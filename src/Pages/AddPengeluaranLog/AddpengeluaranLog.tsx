import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { PengeluaranLogType } from '../../Types/PengeluaranLog';
import { db } from '../../services/db/db';
import { addLog } from '../../services/sync';
import dayjs from 'dayjs';
import { HelperFunction } from '../../lib/HelperFunc';
import { OptionsType } from '../../Types/OptionType';
import ManualForm from './ManualForm';
import { useBookStore } from '../../store/BookStore';

interface modalAlertProps {
	modalOpen: boolean;
	modalClose: () => void;
}

// Today's total as the dashboard shows it: non-special logs in the active book ('default' shows every book).
const todayTotal = async (activeBookId: string) => {
	const today = dayjs().format('YYYY-MM-DD');
	const logs = await db.pengeluaranLogs.where('createdAt').equals(today).toArray();
	return logs.filter((x) => !x.isSpecialCategories && (activeBookId === 'default' || x.bookId === activeBookId)).reduce((t, x) => t + x.amount, 0);
};

export const AddPengeluaranLog = ({ modalOpen, modalClose }: modalAlertProps) => {
	const toast = useToast();
	const { BookDetail } = useBookStore();
	const { isOpen: modalConfirm, onOpen: modalConfirmOpen, onClose: modalConfirmClose } = useDisclosure();
	const [newData, setNewData] = useState<PengeluaranLogType>({
		amount: 0,
		createdAt: dayjs().format('YYYY-MM-DD'),
		name: '',
		bookId: BookDetail.id,
	});
	const [selectedCategories, setSelectedCategories] = useState<OptionsType[]>([]);
	const [selectedBook, setSelectedBook] = useState<OptionsType>({ value: BookDetail.id, label: BookDetail.name, detail: BookDetail });
	const [saving, setSaving] = useState(false);

	const limit = Number(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string) || '0')) || 0;

	const handleAdd = async () => {
		const categoriesId = (selectedCategories ?? []).map((x) => x.value) as PengeluaranLogType['categoriesId'];
		const isSpecialCategories = (selectedCategories ?? []).some((x) => x?.detail?.isSpecialCategories);

		setSaving(true);
		try {
			await addLog({ ...newData, name: newData.name.trim(), categoriesId, isSpecialCategories });
		} catch (error) {
			toast({ colorScheme: 'red', title: 'Gagal menyimpan log pengeluaran', position: 'top-right' });
			setSaving(false);
			modalConfirmClose();
			return;
		}
		modalConfirmClose();
		modalClose();
		toast({ colorScheme: 'green', title: 'tambah log pengeluaran berhasil', position: 'top-right' });

		if (limit <= 0 || isSpecialCategories || newData.createdAt !== dayjs().format('YYYY-MM-DD')) return;
		const total = await todayTotal(BookDetail.id);
		const pct = (100 * total) / limit;
		const pesan = `Pengeluaranmu hari ini sudah mencapai ${HelperFunction.FormatToRupiah(total)}, melewati batas limit ${HelperFunction.FormatToRupiah(limit)}.`;
		if (pct >= 200) {
			toast({ duration: 8000, colorScheme: 'red', title: `Peringatan! ${pesan}`, position: 'top-right' });
		} else if (pct > 100) {
			toast({ duration: 8000, colorScheme: 'yellow', title: pesan, position: 'top-right' });
		}
	};

	const handleBookChange = (option: OptionsType) => {
		setNewData({ ...newData, bookId: option.value as string });
		setSelectedBook(option);
	};

	return (
		<>
			<Modal size="xl" isOpen={modalConfirm} onClose={() => modalConfirmClose()}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Tambah log pengeluaran</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Anda yakin ingin menyimpan log pengeluaran berikut ?</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" mr={3} onClick={() => modalConfirmClose()}>
							Tidak
						</Button>
						<Button colorScheme="green" isLoading={saving} onClick={() => void handleAdd()}>
							Ya
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal isOpen={modalOpen} onClose={() => modalClose()}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Tambah Catatan Pengeluaran</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<ManualForm selectedBook={selectedBook} handleBookChange={handleBookChange} selectedCategories={selectedCategories} handleCategories={(v) => setSelectedCategories(v)} setNewData={setNewData} newData={newData} />
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="gray" mr="12px" onClick={() => modalClose()}>
							tutup
						</Button>
						<Button colorScheme="green" onClick={modalConfirmOpen} isDisabled={!newData.amount || !newData.name.trim()}>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
