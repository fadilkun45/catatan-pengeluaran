// One-way push to a Google Sheet through an Apps Script web app (see apps-script/Code.gs).
// Local-first: a log and its outbox entry are written in one IndexedDB transaction, so recording never waits
// on the network and nothing is lost offline. The outbox is sent when online, oldest first.
import { create } from 'zustand'
import { db, newId } from './db/db'
import { PengeluaranLogType } from '../Types/PengeluaranLog'

export type SyncOp =
    | { op: 'add', uid: string, tanggal: string, nama: string, nominal: number, kategori: string, buku: string, spesial: boolean }
    | { op: 'delete', uid: string }

const URL_KEY = 'SheetUrl'
const BATCH = 200

export const getSheetUrl = () => localStorage.getItem(URL_KEY) ?? ''

export const useSyncStore = create<{ url: string, sending: boolean, error: string }>(() => ({ url: getSheetUrl(), sending: false, error: '' }))

// Category and book names are copied in at write time so the Sheet reads on its own.
async function toAddOp(log: PengeluaranLogType): Promise<SyncOp> {
    const [cats, book] = await Promise.all([
        db.categoriesLog.bulkGet((log.categoriesId ?? []).map(Number)),
        db.books.get(log.bookId ?? 'default'),
    ])
    return {
        op: 'add', uid: log.uid, tanggal: log.createdAt, nama: log.name, nominal: log.amount,
        kategori: cats.filter(Boolean).map((c) => c.name).join(', '), buku: book?.name ?? '', spesial: !!log.isSpecialCategories,
    }
}

const tables = () => [db.pengeluaranLogs, db.syncQueue, db.categoriesLog, db.books]

// Nothing is queued until a Sheet is connected; connecting sends everything (see setSheetUrl).
export async function addLog(log: PengeluaranLogType) {
    const saved = { ...log, uid: newId() }
    await db.transaction('rw', tables(), async () => {
        await db.pengeluaranLogs.add(saved)
        if (getSheetUrl()) await db.syncQueue.add(await toAddOp(saved))
    })
    void flush()
    return saved
}

// The Sheet script skips uids it already has, so an edit goes out as delete(old uid) + add(new uid).
export async function updateLog(log: PengeluaranLogType) {
    const saved = { ...log, uid: newId() }
    await db.transaction('rw', tables(), async () => {
        const old = await db.pengeluaranLogs.get(log.id)
        if (!old) throw new Error('Catatan tidak ditemukan')
        await db.pengeluaranLogs.put(saved)
        if (getSheetUrl()) {
            if (old.uid) await db.syncQueue.add({ op: 'delete', uid: old.uid })
            await db.syncQueue.add(await toAddOp(saved))
        }
    })
    void flush()
    return saved
}

export async function deleteLog(log: PengeluaranLogType) {
    await db.transaction('rw', tables(), async () => {
        await db.pengeluaranLogs.delete(log.id)
        if (getSheetUrl() && log.uid) await db.syncQueue.add({ op: 'delete', uid: log.uid })
    })
    void flush()
}

export async function setSheetUrl(url: string) {
    url = url.trim()
    if (url && !/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) throw new Error('Link harus dari script.google.com (URL web app yang berakhiran /exec).')
    if (!url) {
        localStorage.removeItem(URL_KEY)
        await db.syncQueue.clear()
        return useSyncStore.setState({ url, error: '' })
    }
    localStorage.setItem(URL_KEY, url)
    useSyncStore.setState({ url })
    // Re-send everything; the script skips uids it already has, so this is safe to repeat.
    await db.transaction('rw', tables(), async () => {
        const logs = await db.pengeluaranLogs.toArray()
        await db.syncQueue.clear()
        await db.syncQueue.bulkAdd(await Promise.all(logs.map(toAddOp)))
    })
    await flush()
}

export async function flush(): Promise<void> {
    const url = getSheetUrl()
    if (!url || useSyncStore.getState().sending || !navigator.onLine) return
    const batch = await db.syncQueue.orderBy('seq').limit(BATCH).toArray()
    if (!batch.length) return
    useSyncStore.setState({ sending: true })
    try {
        // text/plain avoids a CORS preflight, which Apps Script can't answer.
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(batch) })
        const json = (await res.json().catch(() => ({ ok: false, error: `Sheet membalas HTTP ${res.status}` }))) as { ok: boolean, error?: string }
        if (!json.ok) throw new Error(json.error || 'Sheet menolak data')
        await db.syncQueue.bulkDelete(batch.map((b) => b.seq)) // only what was sent; ops queued meanwhile stay
        useSyncStore.setState({ sending: false, error: '' })
        return flush()
    } catch (e) {
        useSyncStore.setState({ sending: false, error: e instanceof Error ? e.message : String(e) })
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('online', () => void flush())
    // Mobile PWAs are resumed far more often than they go offline→online.
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void flush() })
}
