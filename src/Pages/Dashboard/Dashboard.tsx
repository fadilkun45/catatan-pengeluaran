import {
	Box,
	Button,
	HStack,
	Icon,
	IconButton,
	Progress,
	Spacer,
	Text,
	VStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FiBook, FiCheck, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import dayjs from 'dayjs';

import LineChart from '../../components/LineChart';
import PieChart from '../../components/PieChart';

import { useBookStore } from '../../store/BookStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';
import { HelperFunction } from '../../lib/HelperFunc';

import { BookLogsType } from '../../Types/BookLogs';
import { PengeluaranLogChartType } from '../../Types/ChartPengeluaranLog';
import { StatCards } from './StatCards';
import { thisMonday } from './dashboardCards';

const Card = ({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) => (
	<Box w="full" bg="white" borderWidth={1} borderColor="gray.100" rounded="xl" shadow="sm" p={4}>
		<HStack mb={3}>
			<Text fontWeight="bold" color="gray.700">{title}</Text>
			<Spacer />
			{right}
		</HStack>
		{children}
	</Box>
);

const Empty = ({ text }: { text: string }) => (
	<VStack h="full" justify="center" py={8}>
		<Text color="gray.500" fontSize="sm">{text}</Text>
	</VStack>
);

export const Dashboard = () => {
	const { isOpen: modalBook, onOpen: modalBookOpen, onClose: modalBookClose } = useDisclosure();
	const { BookDetail, setActiveBooks } = useBookStore();
	const limit = Number(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string) || '0')) || 0;

	const [weekStart, setWeekStart] = useState(thisMonday);
	const firstDate = weekStart.format('YYYY-MM-DD');
	const lastDate = weekStart.add(6, 'day').format('YYYY-MM-DD');
	const isThisWeek = weekStart.isSame(thisMonday(), 'day');

	const inBook = (bookId?: string) => BookDetail?.id === 'default' || bookId === BookDetail?.id;

	const currentExpense = useLiveQuery(() =>
		db.pengeluaranLogs
			.where('createdAt')
			.equals(dayjs().format('YYYY-MM-DD'))
			.filter((x) => !x.isSpecialCategories && inBook(x.bookId))
			.toArray()
			.then((trx) => trx.reduce((total, item) => total + item.amount, 0)), [BookDetail]
	);

	const bookOptions = useLiveQuery(() => db.books.toArray(), []);

	const perWeek = useLiveQuery(() =>
		db.pengeluaranLogs
			.where('createdAt')
			.between(firstDate, lastDate, true, true)
			.filter((x) => !x.isSpecialCategories && inBook(x.bookId))
			.toArray(),
		[firstDate, lastDate, BookDetail]
	);

	const categories = useLiveQuery(() => db.categoriesLog.toArray(), []);

	const weekTotal = perWeek?.reduce((sum, x) => sum + x.amount, 0) || 0;

	const chartPengeluaranLog = useMemo(() => {
		const temp: PengeluaranLogChartType[] = [];
		perWeek?.forEach((y) => {
			const found = temp.find((x) => x.date === y.createdAt);
			if (found) found.total += y.amount;
			else temp.push({ date: y.createdAt, total: y.amount });
		});
		return temp.sort((a, b) => a.date.localeCompare(b.date));
	}, [perWeek]);

	const chartCategories = useMemo(() => (categories || [])
		.map((cat) => ({
			id: cat.name,
			color: cat.labelColor,
			colorText: cat.labelTextColor,
			value: (perWeek || []).filter((x) => cat.id !== undefined && x.categoriesId?.includes(cat.id)).reduce((sum, x) => sum + x.amount, 0),
		}))
		.filter((x) => x.value > 0)
		.sort((a, b) => b.value - a.value), [categories, perWeek]);

	const handleChangeBook = (book: BookLogsType) => {
		modalBookClose();
		setActiveBooks(book);
	};

	const today = currentExpense || 0;
	const overLimit = limit > 0 && today > limit;

	return (
		<>
			<Modal isOpen={modalBook} onClose={modalBookClose} isCentered>
				<ModalOverlay />
				<ModalContent pb={6}>
					<ModalHeader>Ganti buku catatan</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack align="stretch" spacing={2}>
							{bookOptions?.map((book) => {
								const active = BookDetail?.id === book.id;
								return (
									<HStack
										as="button"
										key={book.id}
										px={4}
										py={3}
										borderRadius="md"
										borderWidth={active ? 2 : 1}
										borderColor={active ? 'green.500' : 'gray.200'}
										bg={active ? 'green.50' : 'transparent'}
										fontWeight={active ? 'bold' : 'normal'}
										_hover={{ bg: active ? 'green.50' : 'gray.50' }}
										onClick={() => handleChangeBook(book)}
									>
										<Text fontSize="sm">{book.name}</Text>
										<Spacer />
										{active && <Icon as={FiCheck} color="green.500" />}
									</HStack>
								);
							})}
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>

			<VStack w="full" spacing={4} mt={3}>
				{/* Pengeluaran hari ini */}
				<Box w="full" bg="green.500" color="white" rounded="xl" shadow="md" p={4}>
					<HStack>
						<Text fontSize="sm" opacity={0.9}>Pengeluaran hari ini</Text>
						<Spacer />
						<Button size="xs" variant="solid" bg="whiteAlpha.300" color="white" _hover={{ bg: 'whiteAlpha.400' }} leftIcon={<FiBook />} rightIcon={<FiChevronDown />} onClick={modalBookOpen}>
							{BookDetail?.name || 'Buku'}
						</Button>
					</HStack>
					<Text fontSize="3xl" fontWeight="bold" mt={1}>{HelperFunction.FormatToRupiah(today)}</Text>
					{limit > 0 && (
						<Box mt={3}>
							<Progress value={Math.min(100, (today / limit) * 100)} size="sm" rounded="full" bg="whiteAlpha.300" colorScheme={overLimit ? 'red' : 'yellow'} />
							<Text fontSize="xs" mt={1} opacity={0.9}>
								{overLimit
									? `Lewat ${HelperFunction.FormatToRupiah(today - limit)} dari limit harian`
									: `Sisa ${HelperFunction.FormatToRupiah(limit - today)} dari limit ${HelperFunction.FormatToRupiah(limit)}`}
							</Text>
						</Box>
					)}
				</Box>

				<StatCards />

				{/* Navigasi minggu */}
				<HStack w="full" bg="white" borderWidth={1} borderColor="gray.100" rounded="xl" shadow="sm" px={2} py={2}>
					<IconButton aria-label="Minggu sebelumnya" icon={<FiChevronLeft />} variant="ghost" onClick={() => setWeekStart(weekStart.subtract(7, 'day'))} />
					<VStack flex={1} spacing={0}>
						<Text fontSize="sm" fontWeight="bold" color="gray.700">
							{weekStart.format('D MMM')} – {weekStart.add(6, 'day').format('D MMM YYYY')}
						</Text>
						<Text fontSize="xs" color="gray.500">Total {HelperFunction.FormatToRupiah(weekTotal)}</Text>
					</VStack>
					<IconButton aria-label="Minggu berikutnya" icon={<FiChevronRight />} variant="ghost" isDisabled={isThisWeek} onClick={() => setWeekStart(weekStart.add(7, 'day'))} />
				</HStack>

				<Card
					title="Pengeluaran harian"
					right={!isThisWeek && <Button size="xs" variant="link" colorScheme="green" onClick={() => setWeekStart(thisMonday())}>Minggu ini</Button>}
				>
					<Box h="240px">
						{chartPengeluaranLog.length ? <LineChart data={chartPengeluaranLog} /> : <Empty text="Belum ada pengeluaran di minggu ini" />}
					</Box>
				</Card>

				<Card title="Per kategori">
					{chartCategories.length ? (
						<>
							<Box h="220px">
								<PieChart data={chartCategories} />
							</Box>
							<VStack align="stretch" spacing={2} mt={2}>
								{chartCategories.map((x) => (
									<HStack key={x.id} fontSize="sm">
										<Box w="10px" h="10px" rounded="full" bg={x.color} flexShrink={0} />
										<Text color="gray.700" noOfLines={1}>{x.id}</Text>
										<Spacer />
										<Text color="gray.500" fontSize="xs">{weekTotal ? Math.round((x.value / weekTotal) * 100) : 0}%</Text>
										<Text fontWeight="bold" color="gray.700" minW="90px" textAlign="right">{HelperFunction.FormatToRupiah(x.value)}</Text>
									</HStack>
								))}
							</VStack>
						</>
					) : (
						<Empty text="Belum ada data kategori di minggu ini" />
					)}
				</Card>
			</VStack>
		</>
	);
};
