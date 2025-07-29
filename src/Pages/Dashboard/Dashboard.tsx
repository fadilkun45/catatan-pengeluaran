import {
	Box,
	Divider,
	HStack,
	Input,
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
import { useEffect, useState } from 'react';
import { FaRotate } from 'react-icons/fa6';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

import LineChart from '../../components/LineChart';
import PieChart from '../../components/PieChart';
import NotFound from '../../components/notFound';

import { useLoadingStore } from '../../store/Loading';
import { useBookStore } from '../../store/BookStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';
import { HelperFunction } from '../../lib/HelperFunc';

import { BookLogsType } from '../../Types/BookLogs';
import { PengeluaranLogChartType } from '../../Types/ChartPengeluaranLog';

dayjs.extend(weekday);

export const Dashboard = () => {
	const { isOpen: modalConfirm, onOpen: modalConfirmOpen, onClose: modalConfirmClose } = useDisclosure();

	const setLoading = useLoadingStore((s) => s.setLoading);
	const { BookDetail, setActiveBooks } = useBookStore();

	const [isRendered, setIsRendered] = useState(false);
	const [chartPengeluaranLog, setChartPengeluaranLog] = useState<PengeluaranLogChartType[]>([]);
	const [chartCategories, setChartCategories] = useState<any[]>([]);
	const [selectDate, setSelectDate] = useState({
		firstDate: dayjs(dayjs().format('dddd') === 'Minggu' ? dayjs().day(-7) : dayjs().day(1)).format('YYYY-MM-DD'),
		lastDate: dayjs(dayjs().format('dddd') === 'Minggu' ? dayjs() : dayjs().day(7)).format('YYYY-MM-DD'),
	});

	// Query hari ini
	const currentExpense = useLiveQuery(() =>
		db.pengeluaranLogs
			.where('createdAt')
			.between(dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), true, true)
			.filter((x) => !x.isSpecialCategories && (BookDetail?.id === 'default' ? true : x.bookId === BookDetail.id))
			.toArray()
			.then((trx) => trx.reduce((total, item) => total + item.amount, 0)), [BookDetail]
	);

	// Query daftar buku
	const bookOptions = useLiveQuery(() => db.books.toArray(), []);

	// Query pengeluaran mingguan
	const perWeek = useLiveQuery(() =>
		db.pengeluaranLogs
			.where('createdAt')
			.between(selectDate.firstDate, selectDate.lastDate, true, true)
			.filter((x) => !x.isSpecialCategories && (BookDetail?.id === 'default' ? true : x.bookId === BookDetail.id))
			.toArray()
			.then((results) => BookDetail?.id !== 'default' ? results.filter((r) => r.bookId === BookDetail.id) : results),
		[selectDate, BookDetail]
	);

	// Query kategori
	const categories = useLiveQuery(() => db.categoriesLog.toArray(), []);

	// Inisialisasi buku default
	useEffect(() => {
		const addDefaultBook = async () => {
			const defaultBook = await db.books.get('default');
			if (!defaultBook) {
				await db.books.add({
					id: 'default',
					name: 'Buku Utama',
					createdAt: dayjs().format('YYYY-MM-DD'),
				});
				localStorage.setItem(import.meta.env.VITE_REACT_BOOKS, JSON.stringify({
					id: 'default',
					name: 'Buku Utama',
					createdAt: dayjs().format('YYYY-MM-DD'),
				}));
			}
		};
		void addDefaultBook();
	}, []);

	// Render pengeluaran mingguan untuk line chart
	useEffect(() => {
		const temp: PengeluaranLogChartType[] = [];

		perWeek?.forEach((y) => {
			const index = temp.findIndex((x) => x.date === y.createdAt);
			if (index === -1) {
				temp.push({ date: y.createdAt, total: y.amount });
			} else {
				temp[index].total += y.amount;
			}
		});

		setChartPengeluaranLog(temp);
	}, [perWeek, BookDetail]);

	// Render pie chart berdasarkan kategori
	useEffect(() => {
		if (!categories) return;

		const perCategories = categories.map((cat) => {
			const items = perWeek?.filter((x) => x.categoriesId?.includes(cat.id)) || [];
			const total = items.reduce((sum, x) => sum + x.amount, 0);

			return {
				id: cat.name,
				color: cat.labelColor,
				colorText: cat.labelTextColor,
				value: total,
			};
		}).filter((x) => x.value > 0);

		setChartCategories(perCategories);
	}, [categories, perWeek]);

	useEffect(() => {
		setLoading(true);
		setIsRendered(true);
		setLoading(false);
	}, []);

	// Ganti buku aktif
	const handleChangeBook = (book: BookLogsType) => {
		modalConfirmClose();
		localStorage.setItem(import.meta.env.VITE_REACT_BOOKS, JSON.stringify(book));
		setActiveBooks(book);
	};

	return (
		<>
			<Modal size="xl" isOpen={modalConfirm} onClose={modalConfirmClose}>
				<ModalOverlay />
				<ModalContent pb={6}>
					<ModalHeader>Ganti buku catatan</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Silakan pilih buku catatan Anda yang lain:</Text>
						<VStack align="stretch" spacing={2} mt={6}>
							{bookOptions?.map((book) => (
								<Box
									key={book.id}
									px={4}
									py={2}
									borderRadius="md"
									borderWidth={1}
									cursor="pointer"
									onClick={() => void handleChangeBook(book)}
									bg={BookDetail?.id === book.id ? 'green.500' : 'transparent'}
									color={BookDetail?.id === book.id ? 'white' : 'gray.700'}
								>
									{book.name}
								</Box>
							))}
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>

			<VStack w="full">
				{/* Pengeluaran hari ini */}
				<Box w="full" mb={4}>
					<Text fontSize="lg" color="gray.600">Pengeluaran hari ini:</Text>
					<Text
						fontSize="2xl"
						fontWeight="bold"
						color="gray.600"
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						{HelperFunction.FormatToRupiah(currentExpense || 0)}
						<FaRotate cursor="pointer" onClick={modalConfirmOpen} />
					</Text>
				</Box>

				{/* Tanggal filter */}
				<Box w="full" mb={4}>
					<Text fontSize="lg" color="gray.600">Statistik pengeluaran dalam 1 minggu</Text>
					<Divider mt={3} />
					<HStack mt={4} spacing={4}>
						<Box w="100%">
							<Text mb={1} fontSize="sm">Tanggal Awal</Text>
							<Input
								type="date"
								value={selectDate.firstDate}
								onChange={(e) =>
									setSelectDate({
										...selectDate,
										firstDate: dayjs(e.target.value).format('YYYY-MM-DD'),
										lastDate: dayjs(dayjs(e.target.value).day(7)).format('YYYY-MM-DD'),
									})
								}
							/>
						</Box>
						<Box w="100%">
							<Text mb={1} fontSize="sm">Tanggal Akhir</Text>
							<Input
								type="date"
								min={selectDate.firstDate}
								max={dayjs(dayjs(selectDate.firstDate).day(7)).format('YYYY-MM-DD')}
								value={selectDate.lastDate}
								onChange={(e) =>
									setSelectDate({
										...selectDate,
										lastDate: dayjs(e.target.value).format('YYYY-MM-DD'),
									})
								}
							/>
						</Box>
					</HStack>
				</Box>

				{/* Line Chart */}
				<Box w="90%" h="50vh" mb={4}>
					{isRendered && (chartPengeluaranLog.length !== 0 ? <LineChart data={chartPengeluaranLog} /> : <NotFound />)}
				</Box>

				{/* Pie Chart */}
				<Box w="full" mb={4}>
					<Text fontSize="lg" color="gray.600">Total berdasarkan kategori</Text>
				</Box>
				<Box w="100%" h="65vh">
					{isRendered ? (chartCategories.length !== 0 ? <PieChart data={chartCategories} /> : <NotFound />) : null}
				</Box>
			</VStack>
		</>
	);
};
