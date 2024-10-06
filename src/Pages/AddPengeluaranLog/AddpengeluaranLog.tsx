import { Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { PengeluaranLogType } from '../../Types/PengeluaranLog';
import { db } from '../../services/db/db';
import dayjs from 'dayjs';
import { HelperFunction } from '../../lib/HelperFunc';
import { useLiveQuery } from 'dexie-react-hooks';
import { CategoriesLogType } from '../../Types/CategoriesLog';
import { Dropdown } from '../../components/Dropdown';
import { OptionsType } from '../../Types/OptionType';

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
	const [selectedCategories, setSelectedCategories] = useState< OptionsType[]>([]);
	const [availableOptions, setAvailableOptions] = useState<OptionsType[]>([]);

	const categories = useLiveQuery(() => {
		const result = db.categoriesLog.toArray();
		return result;
	}, []);

	useEffect(() => {
		const format = HelperFunction.FormatOptions(categories as unknown[], 'name', 'id');
		setAvailableOptions(format);
	}, [categories]);

	const BeforeAdd = () => {
		modalConfirmOpen();
	};

	const handleAdd = () => {
		const categoriesId = selectedCategories?.map((x) => {
			return  x.value
		})

		try {
			void db.pengeluaranLogs.add({...newData, categoriesId});
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

	const handleAddCategories = (v: OptionsType[]) => {
		setSelectedCategories(v)
	};

	return (
		<>
			<Modal isOpen={modalConfirm} onClose={() => modalConfirmClose()}>
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
						<Button colorScheme="green" onClick={() => void handleAdd()}>
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
						<VStack w="full">
							<Text w="full" mb="4px">
								Nama Pengeluaran
							</Text>
							<Input fontSize="sm" onChange={(v: React.ChangeEvent<HTMLInputElement>) => setNewData({ ...newData, name: v.target.value })} mb="8px" w="full" />
							<Text w="full" mb="4px">
								Total pengeluaran
							</Text>
							<Input
								fontSize="sm"
								value={HelperFunction.FormatToRupiah2(newData.amount)}
								onChange={(v: React.ChangeEvent<HTMLInputElement>) =>
									setNewData({
										...newData,
										amount: Number.isNaN(parseInt(v.target.value)) ? 0 : parseInt(HelperFunction.onlyNumber(v.target.value)),
									})
								}
								mb="8px"
								w="full"
							/>
							<Text w="full" mb="4px">
								Tanggal
							</Text>
							<Input fontSize="sm" value={newData.createdAt} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setNewData({ ...newData, createdAt: v.target.value })} type="date" mb="8px" w="full" />
							<Text w="full" mb="4px">
								Kategori
							</Text>
							<HStack w={'full'}>
								<Dropdown isMultiple options={availableOptions} onChange={handleAddCategories} value={selectedCategories} />
							</HStack>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="gray" mr="12px" onClick={() => modalClose()}>
							tutup
						</Button>
						<Button colorScheme="green" onClick={BeforeAdd} isDisabled={!newData.amount || !newData.name ? true : false}>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
