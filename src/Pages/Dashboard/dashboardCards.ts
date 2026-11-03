import dayjs from 'dayjs';
import { PengeluaranLogType } from '../../Types/PengeluaranLog';

export const PERIODS = { today: 'Hari ini', week: 'Minggu ini', month: 'Bulan ini' } as const;
export type Period = keyof typeof PERIODS;
export type StatCard = { id: string; categoryId: number | 'all'; period: Period };

const KEY = 'DashboardCards';

// Senin minggu ini
export const thisMonday = () => dayjs().subtract((dayjs().day() + 6) % 7, 'day').startOf('day');

export const periodStart = (p: Period) =>
	(p === 'today' ? dayjs() : p === 'week' ? thisMonday() : dayjs().startOf('month')).format('YYYY-MM-DD');

// "Semua" mengikuti total harian (tanpa kategori spesial); kartu per kategori menghitung semua catatan di kategori itu.
export const sumForCard = (logs: PengeluaranLogType[], card: StatCard, today = dayjs().format('YYYY-MM-DD')) => {
	const from = periodStart(card.period);
	return logs
		.filter((l) => l.createdAt >= from && l.createdAt <= today)
		.filter((l) => (card.categoryId === 'all' ? !l.isSpecialCategories : (l.categoriesId ?? []).map(Number).includes(card.categoryId)))
		.reduce((sum, l) => sum + l.amount, 0);
};

export const loadCards = (): StatCard[] => {
	try {
		return JSON.parse(localStorage.getItem(KEY) || '[]') as StatCard[];
	} catch {
		return [];
	}
};

export const saveCards = (cards: StatCard[]) => {
	try {
		localStorage.setItem(KEY, JSON.stringify(cards));
	} catch {
		/* storage penuh/diblokir: kartu tetap tampil sampai reload */
	}
};
