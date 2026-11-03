import { expect, it } from 'vitest'
import dayjs from 'dayjs'
import { StatCard, cardValue, loadCards, periodStart, sumForCard } from './dashboardCards'

const today = dayjs().format('YYYY-MM-DD')
const logs = [
    { name: 'kopi', amount: 20000, createdAt: today, categoriesId: [1] as [number] },
    { name: 'kos', amount: 900000, createdAt: today, categoriesId: [2] as [number], isSpecialCategories: true },
    { name: 'lama', amount: 5000, createdAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'), categoriesId: [1] as [number] },
    { name: 'besok', amount: 7000, createdAt: dayjs().add(1, 'day').format('YYYY-MM-DD'), categoriesId: [1] as [number] },
]
const card = (kind: StatCard['kind'], period: StatCard['period'] = 'today', categoryId?: number): StatCard => ({ id: kind, kind, period, categoryId })

it('sumForCard per jenis kartu (di luar periode & tanggal depan tidak ikut)', () => {
    expect(sumForCard(logs, card('normal', 'month'), today)).toBe(20000)
    expect(sumForCard(logs, card('all', 'month'), today)).toBe(920000)
    expect(sumForCard(logs, card('special', 'week'), today)).toBe(900000)
    expect(sumForCard(logs, card('category', 'today', 1), today)).toBe(20000)
    expect(periodStart('week') <= today && periodStart('month') <= today).toBe(true)
})

it('sisa limit = limit × hari periode − pengeluaran biasa', () => {
    expect(cardValue(logs, card('limit', 'today'), 50000, today)).toBe(30000)
    expect(cardValue(logs, card('limit', 'week'), 50000, today)).toBe(350000 - 20000)
    expect(cardValue(logs, card('limit', 'today'), 10000, today)).toBe(-10000) // lewat limit
})

it('kartu versi lama tetap terbaca', () => {
    const mem = new Map<string, string>([['DashboardCards', JSON.stringify([{ id: 'x', categoryId: 'all', period: 'month' }, { id: 'y', categoryId: 3, period: 'week' }])]])
    globalThis.localStorage = { getItem: (k: string) => mem.get(k) ?? null } as Storage
    expect(loadCards()).toEqual([{ id: 'x', kind: 'normal', period: 'month' }, { id: 'y', kind: 'category', categoryId: 3, period: 'week' }])
})
