import dayjs from 'dayjs';
import { PengeluaranLogType } from '../../Types/PengeluaranLog';

export const PERIODS = { today: 'Hari ini', week: 'Minggu ini', month: 'Bulan ini' } as const;
export type Period = keyof typeof PERIODS;

export const KINDS = {
	normal: 'Pengeluaran biasa',
	all: 'Semua pengeluaran',
	special: 'Kategori spesial',
	category: 'Per kategori',
	limit: 'Sisa limit',
} as const;
export type Kind = keyof typeof KINDS;

export type StatCard = { id: string; kind: Kind; categoryId?: number; period: Period };

const KEY = 'DashboardCards';

// Senin minggu ini
export const thisMonday = () => dayjs().subtract((dayjs().day() + 6) % 7, 'day').startOf('day');

export const periodStart = (p: Period) =>
	(p === 'today' ? dayjs() : p === 'week' ? thisMonday() : dayjs().startOf('month')).format('YYYY-MM-DD');

export const periodDays = (p: Period, today = dayjs().format('YYYY-MM-DD')) =>
	p === 'today' ? 1 : p === 'week' ? 7 : dayjs(today).daysInMonth();

const matches = (l: PengeluaranLogType, card: StatCard) => {
	if (card.kind === 'all') return true;
	if (card.kind === 'special') return !!l.isSpecialCategories;
	if (card.kind === 'category') return (l.categoriesId ?? []).map(Number).includes(card.categoryId ?? -1);
	return !l.isSpecialCategories; // normal & limit: sama dengan total harian
};

export const sumForCard = (logs: PengeluaranLogType[], card: StatCard, today = dayjs().format('YYYY-MM-DD')) => {
	const from = periodStart(card.period);
	return logs
		.filter((l) => l.createdAt >= from && l.createdAt <= today && matches(l, card))
		.reduce((sum, l) => sum + l.amount, 0);
};

// Sisa limit = limit harian × jumlah hari periode − pengeluaran biasa. Negatif berarti lewat limit.
export const cardValue = (logs: PengeluaranLogType[], card: StatCard, limit: number, today = dayjs().format('YYYY-MM-DD')) =>
	card.kind === 'limit' ? limit * periodDays(card.period, today) - sumForCard(logs, card, today) : sumForCard(logs, card, today);

type OldCard = { id: string; categoryId: number | 'all'; period: Period };

export const loadCards = (): StatCard[] => {
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) || '[]') as (StatCard | OldCard)[];
		// kartu versi lama (tanpa "kind")
		return raw.map((c) =>
			'kind' in c ? c : c.categoryId === 'all' ? { id: c.id, kind: 'normal', period: c.period } : { id: c.id, kind: 'category', categoryId: c.categoryId, period: c.period }
		);
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
