import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { PengeluaranLogType } from '../../Types/PengeluaranLog';
import { db } from '../../services/db/db';
import dayjs from 'dayjs';
import { HelperFunction } from '../../lib/HelperFunc';
import { useLiveQuery } from 'dexie-react-hooks';
import { OptionsType } from '../../Types/OptionType';
import ManualForm from './ManualForm';
import ImageForm from './ImageForm';

interface modalAlertProps {
	modalOpen: boolean;
	modalClose: () => void;
}

export const AddPengeluaranLog = ({ modalOpen, modalClose }: modalAlertProps) => {
	const toast = useToast();
	const { isOpen: modalConfirm, onOpen: modalConfirmOpen, onClose: modalConfirmClose } = useDisclosure();
	const [newData, setNewData] = useState<PengeluaranLogType>({
		amount: 0,
		createdAt: dayjs().format('YYYY-MM-DD'),
		name: '',
	});
	const [selectedCategories, setSelectedCategories] = useState<OptionsType[]>([]);
	const [dataFromImage, setDataFromImage] = useState<PengeluaranLogType[]>([]);
	const [imageTab, setImageTab] = useState(false)
	const currentExpense = useLiveQuery(() => {
		const result = db.pengeluaranLogs
			.where('createdAt')
			.between(dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), true, true)
			.toArray()
			.then((transaction) => transaction.reduce((total, transaction) => total + transaction.amount, 0))
			.then((x) => !x.isSpecialCategories);
		return result;
	}, []);


	const [limit] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string)) || 0);

	const BeforeAdd = () => {
		modalConfirmOpen();
	};

	const handleAdd =  () => {
		let isSpecialCategories = false;
		const categoriesId = selectedCategories?.map((x) => {
			if (x?.detail?.isSpecialCategories) {
				isSpecialCategories = true;
			}
			return x.value;
		});

		const currentExpenseNew: any = isSpecialCategories ? currentExpense : (currentExpense as unknown as number) + newData.amount;

		try {
			void db.pengeluaranLogs.add({ ...newData, categoriesId, isSpecialCategories }, { allKeys: true }).then(() => {
				if (newData.createdAt !== dayjs().format('YYYY-MM-DD')) return;

				const currentExpensePercentage = (100 * currentExpenseNew) / limit;

				if (currentExpensePercentage > 100 && limit > 0) {
					toast({
						duration: 8000,
						colorScheme: 'yellow',
						title: `Pengeluaranmu hari ini sudah mencapai ${HelperFunction.FormatToRupiah(currentExpenseNew)}, melewati batas limit ${HelperFunction.FormatToRupiah(limit)}.`,
						position: 'top-right',
					});
				}
				if (currentExpensePercentage / (limit * 2) >= 200 && limit > 0) {
					toast({
						duration: 8000,
						colorScheme: 'red',
						title: `Peringatan Pengeluaranmu hari ini sudah mencapai ${HelperFunction.FormatToRupiah(currentExpenseNew)}, melewati batas limit ${HelperFunction.FormatToRupiah(limit)}.`,
						position: 'top-right',
					});
				}
			});

			modalConfirmClose();
			modalClose();
			toast({
				colorScheme: 'green',
				title: 'tambah log pengeluaran berhasil',
				position: 'top-right',
			});
		} catch (error) {
			toast({
				colorScheme: 'red',
				title: 'error log tambah pengeluaran',
				position: 'top-right',
			});
			modalConfirmClose();
			modalClose();
		}
	};

	const handleAddFromImage = () => {
		const newData: any = [];
		let totalAll = 0;

		dataFromImage?.map((item) => {
			let isSpecialCategories = false;
			const categoriesId = item?.selectedCategories?.map((x) => {
				if (x?.detail?.isSpecialCategories) {
					isSpecialCategories = true;
				}
				return x.value;
			});
			delete item.selectedCategories;
			item.isSpecialCategories = isSpecialCategories;
			item.categoriesId = categoriesId;
			if(!isSpecialCategories){
				totalAll +=  item.amount; 
			}
			
			newData.push(item);
		});

		const currentExpenseNew: any = parseInt(currentExpense) + parseInt(totalAll);

		try {
			
			void db.pengeluaranLogs.bulkAdd(newData, { allKeys: true }).then(() => {
				const currentExpensePercentage = (100 * currentExpenseNew) / limit;

				if (currentExpensePercentage > 100 && limit > 0) {
					toast({
						duration: 8000,
						colorScheme: 'yellow',
						title: `Pengeluaranmu hari ini sudah mencapai ${HelperFunction.FormatToRupiah(currentExpenseNew)}, melewati batas limit ${HelperFunction.FormatToRupiah(limit)}.`,
						position: 'top-right',
					});
				}
				if (currentExpensePercentage / (limit * 2) >= 200 && limit > 0) {
					toast({
						duration: 8000,
						colorScheme: 'red',
						title: `Peringatan Pengeluaranmu hari ini sudah mencapai ${HelperFunction.FormatToRupiah(currentExpenseNew)}, melewati batas limit ${HelperFunction.FormatToRupiah(limit)}.`,
						position: 'top-right',
					});
				}
			});

			modalConfirmClose();
			modalClose();
			toast({
				colorScheme: 'green',
				title: 'tambah log pengeluaran berhasil',
				position: 'top-right',
			});
		} catch (error) {
				toast({
					colorScheme: 'red',
					title: 'error log tambah pengeluaran',
					position: 'top-right',
				});
				modalConfirmClose();
				modalClose();
		}
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
						<Button
							colorScheme="green"
							onClick={() => {
								imageTab ? void handleAddFromImage() : void handleAdd();
							}}
						>
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
						<Tabs colorScheme="green">
							<TabList>
								<Tab
									width="50%"
									onClick={() => {
										setDataFromImage([]);
										setImageTab(false);
									}}
								>
									Form
								</Tab>
								<Tab
									width="50%"
									onClick={() => {
										setImageTab(true);
										setDataFromImage([]);
										setNewData({
											amount: 0,
											createdAt: dayjs().format('YYYY-MM-DD'),
											name: '',
										});
										setSelectedCategories(null);
									}}
								>
									Foto
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<ManualForm selectedCategories={selectedCategories} handleCategories={(v) => setSelectedCategories(v)} setNewData={setNewData} newData={newData} />
								</TabPanel>
								<TabPanel>{imageTab && <ImageForm parentData={dataFromImage} setImageFromData={setDataFromImage} />}</TabPanel>
							</TabPanels>
						</Tabs>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="gray" mr="12px" onClick={() => modalClose()}>
							tutup
						</Button>
						<Button colorScheme="green" onClick={BeforeAdd} isDisabled={imageTab ? (!dataFromImage || dataFromImage?.length == 0 ? true : false) : !newData.amount || !newData.name ? true : false}>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
