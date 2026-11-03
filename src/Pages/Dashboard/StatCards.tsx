import { Box, Button, Grid, HStack, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, newId } from '../../services/db/db';
import { useBookStore } from '../../store/BookStore';
import { HelperFunction } from '../../lib/HelperFunc';
import { KINDS, Kind, PERIODS, Period, StatCard, cardValue, loadCards, periodStart, saveCards } from './dashboardCards';

export const StatCards = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { BookDetail } = useBookStore();
	const [cards, setCards] = useState<StatCard[]>(loadCards);
	const [draft, setDraft] = useState<{ kind: Kind; categoryId: string; period: Period }>({ kind: 'normal', categoryId: '', period: 'month' });
	const limit = Number(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string) || '0')) || 0;

	const inBook = (bookId?: string) => BookDetail?.id === 'default' || bookId === BookDetail?.id;
	const from = [periodStart('week'), periodStart('month')].sort()[0];

	const logs = useLiveQuery(
		() => db.pengeluaranLogs.where('createdAt').between(from, dayjs().format('YYYY-MM-DD'), true, true).filter((x) => inBook(x.bookId)).toArray(),
		[from, BookDetail]
	);
	const categories = useLiveQuery(() => db.categoriesLog.filter((c) => inBook(c.bookId)).toArray(), [BookDetail]);

	const update = (next: StatCard[]) => {
		setCards(next);
		saveCards(next);
	};

	const handleAdd = () => {
		const card: StatCard = { id: newId(), kind: draft.kind, period: draft.period };
		if (draft.kind === 'category') card.categoryId = Number(draft.categoryId);
		update([...cards, card]);
		onClose();
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Tambah kartu statistik</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack align="stretch" spacing={4}>
							<Box>
								<Text mb={2} fontSize="sm" color="gray.600">Jenis kartu</Text>
								<Select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as Kind })}>
									{(Object.keys(KINDS) as Kind[]).map((k) => <option key={k} value={k}>{KINDS[k]}</option>)}
								</Select>
								{draft.kind === 'limit' && (
									<Text mt={1} fontSize="xs" color="gray.500">
										{limit > 0 ? `Limit harian ${HelperFunction.FormatToRupiah(limit)} × jumlah hari di periode` : 'Limit harian belum diatur. Atur dulu di Options.'}
									</Text>
								)}
							</Box>
							{draft.kind === 'category' && (
								<Box>
									<Text mb={2} fontSize="sm" color="gray.600">Kategori</Text>
									<Select placeholder="Pilih kategori" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
										{categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
									</Select>
								</Box>
							)}
							<Box>
								<Text mb={2} fontSize="sm" color="gray.600">Periode</Text>
								<Select value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value as Period })}>
									{(Object.keys(PERIODS) as Period[]).map((p) => <option key={p} value={p}>{PERIODS[p]}</option>)}
								</Select>
							</Box>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="green" w="full" isDisabled={draft.kind === 'category' && !draft.categoryId} onClick={handleAdd}>Tambah</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Grid w="full" templateColumns="repeat(2, 1fr)" gap={3}>
				{cards.map((card) => {
					const cat = card.kind === 'category' ? categories?.find((c) => c.id === card.categoryId) : undefined;
					// kategori sudah dihapus / milik buku lain: kartunya disembunyikan
					if (card.kind === 'category' && (!categories || !cat)) return null;
					const value = cardValue(logs ?? [], card, limit);
					const over = card.kind === 'limit' && value < 0;
					return (
						<Box key={card.id} bg="white" borderWidth={1} borderColor="gray.100" rounded="xl" shadow="sm" p={3} position="relative">
							<HStack spacing={2} pr={6}>
								<Box w="8px" h="8px" rounded="full" flexShrink={0} bg={cat?.labelColor ?? (card.kind === 'limit' ? (over ? 'red.400' : 'yellow.400') : card.kind === 'special' ? 'gray.400' : 'green.400')} />
								<Text fontSize="sm" color="gray.700" fontWeight="semibold" noOfLines={1}>{cat?.name ?? KINDS[card.kind]}</Text>
							</HStack>
							<Text fontSize="xs" color="gray.500">{PERIODS[card.period]}</Text>
							{card.kind === 'limit' && limit <= 0 ? (
								<Text mt={1} fontSize="xs" color="gray.500">Limit belum diatur</Text>
							) : (
								<Text mt={1} fontWeight="bold" color={over ? 'red.500' : 'gray.800'} noOfLines={1}>
									{over ? `Lewat ${HelperFunction.FormatToRupiah(-value)}` : HelperFunction.FormatToRupiah(value)}
								</Text>
							)}
							<IconButton
								aria-label="Hapus kartu"
								icon={<FiX />}
								size="xs"
								variant="ghost"
								position="absolute"
								top={1}
								right={1}
								onClick={() => update(cards.filter((c) => c.id !== card.id))}
							/>
						</Box>
					);
				})}
				<Button onClick={onOpen} h="auto" minH="80px" variant="outline" borderStyle="dashed" borderColor="gray.300" color="gray.500" rounded="xl" flexDirection="column" gap={1}>
					<Icon as={FiPlus} />
					<Text fontSize="xs" fontWeight="normal">Tambah kartu</Text>
				</Button>
			</Grid>
		</>
	);
};
