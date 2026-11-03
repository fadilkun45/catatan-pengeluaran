import { expect, it } from 'vitest'
import dayjs from 'dayjs'
import { periodStart, sumForCard } from './dashboardCards'

it('sumForCard: filter periode, kategori, dan kategori spesial', () => {
    const today = dayjs().format('YYYY-MM-DD')
    const lastYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
    const logs = [
        { name: 'kopi', amount: 20000, createdAt: today, categoriesId: [1] as [number] },
        { name: 'kos', amount: 900000, createdAt: today, categoriesId: [2] as [number], isSpecialCategories: true },
        { name: 'lama', amount: 5000, createdAt: lastYear, categoriesId: [1] as [number] },
        { name: 'besok', amount: 7000, createdAt: tomorrow, categoriesId: [1] as [number] },
    ]
    expect(sumForCard(logs, { id: 'a', categoryId: 'all', period: 'month' }, today)).toBe(20000) // spesial & luar periode tidak ikut
    expect(sumForCard(logs, { id: 'b', categoryId: 2, period: 'today' }, today)).toBe(900000) // kartu kategori spesial tetap dihitung
    expect(sumForCard(logs, { id: 'c', categoryId: 1, period: 'week' }, today)).toBe(20000)
    expect(periodStart('week') <= today && periodStart('month') <= today).toBe(true)
})
