import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { describe, expect, it, vi } from 'vitest'

// Minimal localStorage/navigator so the real db + sync code runs unchanged.
const mem = new Map<string, string>()
globalThis.localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(), key: () => null, length: 0,
} as Storage
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true })

// A database as the old app (schema v2) left it, written before the app's db module is loaded.
const old = new Dexie('pengeluaran')
old.version(2).stores({
    pengeluaranLogs: '++id, createdAt, name, amount, categoriesId, isSpecialCategories, bookId',
    categoriesLog: '++id, createdAt, name, desc, labelColor, labelTextColor, isSpecialCategories, bookId',
    books: '++id, name, createdAt',
})
await old.table('books').add({ id: 'default', name: 'Buku Utama', createdAt: '2025-01-01' })
const catId = await old.table('categoriesLog').add({ name: 'Makan', createdAt: '2025-01-01' }) as number
await old.table('pengeluaranLogs').bulkAdd([
    { name: 'kopi', amount: 20000, createdAt: '2025-07-01', categoriesId: [catId], bookId: 'default' },
    { name: 'parkir', amount: 5000, createdAt: '2025-07-01' }, // saved by the old buggy form without bookId
])
old.close()

const { db } = await import('./db/db')
const { addLog, deleteLog, flush, setSheetUrl, useSyncStore } = await import('./sync')
const URL = 'https://script.google.com/macros/s/abc/exec'
const sent = (f: ReturnType<typeof vi.fn>) => JSON.parse((f.mock.calls[f.mock.calls.length - 1] as [string, RequestInit])[1].body as string) as Record<string, unknown>[]

describe('migrasi v2 → v3', () => {
    it('data lama tetap ada, dapat uid unik dan bookId', async () => {
        const logs = await db.pengeluaranLogs.toArray()
        expect(logs.map((l) => l.name)).toEqual(['kopi', 'parkir'])
        expect(new Set(logs.map((l) => l.uid)).size).toBe(2)
        expect(logs.every((l) => l.bookId === 'default')).toBe(true)
    })
})

describe('sync ke Sheet', () => {
    it('tanpa Sheet: catat jalan, tidak ada antrean', async () => {
        globalThis.fetch = vi.fn()
        await addLog({ name: 'bakso', amount: 15000, createdAt: '2025-07-02', bookId: 'default' })
        expect(await db.syncQueue.count()).toBe(0)
        expect(globalThis.fetch).not.toHaveBeenCalled()
    })

    it('offline/gagal: semua tertahan di antrean; online: terkirim lengkap lalu kosong', async () => {
        const fetchMock = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
        globalThis.fetch = fetchMock
        await setSheetUrl(URL) // queues the 3 existing logs
        const teh = await addLog({ name: 'es teh', amount: 5000, createdAt: '2025-07-03', bookId: 'default', categoriesId: [catId] })
        await vi.waitFor(() => expect(useSyncStore.getState().sending).toBe(false))
        expect(await db.syncQueue.count()).toBe(4)
        expect(useSyncStore.getState().error).toBe('Failed to fetch')

        await deleteLog(teh)
        expect(await db.syncQueue.count()).toBe(5)

        fetchMock.mockResolvedValue({ status: 200, json: () => Promise.resolve({ ok: true }) })
        await flush()
        expect(await db.syncQueue.count()).toBe(0)
        expect(useSyncStore.getState().error).toBe('')
        const ops = sent(fetchMock)
        expect(ops.find((o) => o.nama === 'es teh')).toMatchObject({ op: 'add', kategori: 'Makan', buku: 'Buku Utama', nominal: 5000, tanggal: '2025-07-03' })
        expect(ops[ops.length - 1]).toMatchObject({ op: 'delete', uid: teh.uid })
    })

    it('Sheet menolak: antrean tidak dibuang', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({ status: 200, json: () => Promise.resolve({ ok: false, error: 'quota' }) })
        await addLog({ name: 'bensin', amount: 30000, createdAt: '2025-07-04', bookId: 'default' })
        await vi.waitFor(() => expect(useSyncStore.getState().sending).toBe(false))
        expect(await db.syncQueue.count()).toBe(1)
        expect(useSyncStore.getState().error).toBe('quota')
    })

    it('menolak link selain Apps Script; memutuskan link mengosongkan antrean', async () => {
        await expect(setSheetUrl('https://evil.example/exec')).rejects.toThrow()
        await setSheetUrl('')
        expect(await db.syncQueue.count()).toBe(0)
    })
})
