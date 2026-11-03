import { Box, Button, Grid, HStack, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, newId } from '../../services/db/db';
import { useBookStore } from '../../store/BookStore';
import { HelperFunction } from '../../lib/HelperFunc';
import { PERIODS, Period, StatCard, loadCards, periodStart, saveCards, sumForCard } from './dashboardCards';

export const StatCards = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { BookDetail } = useBookStore();
	const [cards, setCards] = useState<StatCard[]>(loadCards);
	const [draft, setDraft] = useState<{ categoryId: string; period: Period }>({ categoryId: 'all', period: 'month' });

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
		update([...cards, { id: newId(), categoryId: draft.categoryId === 'all' ? 'all' : Number(draft.categoryId), period: draft.period }]);
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
								<Text mb={2} fontSize="sm" color="gray.600">Kategori</Text>
								<Select value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
									<option value="all">Semua pengeluaran</option>
									{categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
								</Select>
							</Box>
							<Box>
								<Text mb={2} fontSize="sm" color="gray.600">Periode</Text>
								<Select value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value as Period })}>
									{(Object.keys(PERIODS) as Period[]).map((p) => <option key={p} value={p}>{PERIODS[p]}</option>)}
								</Select>
							</Box>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="green" w="full" onClick={handleAdd}>Tambah</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Grid w="full" templateColumns="repeat(2, 1fr)" gap={3}>
				{cards.map((card) => {
					const cat = card.categoryId === 'all' ? null : categories?.find((c) => c.id === card.categoryId);
					// kategori sudah dihapus / milik buku lain: kartunya disembunyikan
					if (card.categoryId !== 'all' && categories && !cat) return null;
					return (
						<Box key={card.id} bg="white" borderWidth={1} borderColor="gray.100" rounded="xl" shadow="sm" p={3} position="relative">
							<HStack spacing={2} pr={6}>
								<Box w="8px" h="8px" rounded="full" flexShrink={0} bg={cat?.labelColor ?? 'green.400'} />
								<Text fontSize="sm" color="gray.700" fontWeight="semibold" noOfLines={1}>{cat?.name ?? 'Semua'}</Text>
							</HStack>
							<Text fontSize="xs" color="gray.500">{PERIODS[card.period]}</Text>
							<Text mt={1} fontWeight="bold" color="gray.800" noOfLines={1}>{HelperFunction.FormatToRupiah(sumForCard(logs ?? [], card))}</Text>
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
