import React, { useEffect, useState } from 'react';
import { HStack, Input, Text, VStack } from '@chakra-ui/react';
import { HelperFunction } from '../../lib/HelperFunc';
import { Dropdown } from '../../components/Dropdown';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';
import { OptionsType } from '../../Types/OptionType';
import { useBookStore } from '../../store/BookStore';

const ManualForm = ({
	setNewData,
	newData,
	handleCategories,
	selectedBook,
	handleBookChange,

	selectedCategories,
}: {
	setNewData: (parms: any) => void;
	handleCategories: (parms: any) => void;
	newData: any;
	selectedCategories: any;
	selectedBook: any;
	handleBookChange: (parms: any) => void;
}) => {
	const [availableCategories, setAvailableCategories] = useState<OptionsType[]>([]);
	const [availableBooks, setAvailableBooks] = useState<OptionsType[]>([]);
	const { BookDetail, setActiveBooks } = useBookStore();

	const categories = useLiveQuery(() => db.categoriesLog.filter((item) => BookDetail?.id === 'default' ? true : item.bookId === BookDetail?.id).toArray(), [BookDetail]);
	const books = useLiveQuery(() => db.books.toArray(), []);

	useEffect(() => {
		if (categories) {
			const formatted = HelperFunction.FormatOptions(categories, 'name', 'id');
			setAvailableCategories(formatted);
		}
	}, [categories]);

	useEffect(() => {
		if (books) {
			const formatted = HelperFunction.FormatOptions(books, 'name', 'id');
			setAvailableBooks(formatted);
		}
	}, [books]);


	return (
		<VStack w="full" align="stretch">
			<Text mb="4px">Nama Pengeluaran</Text>
			<Input
				value={newData?.name}
				fontSize="sm"
				onChange={(e) => setNewData({ ...newData, name: e.target.value })}
				mb="8px"
			/>

			<Text mb="4px">Total Pengeluaran</Text>
			<Input
				fontSize="sm"
				value={HelperFunction.FormatToRupiah2(newData.amount)}
				onChange={(e) =>
					setNewData({
						...newData,
						amount: Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(HelperFunction.onlyNumber(e.target.value)),
					})
				}
				mb="8px"
			/>

			<Text mb="4px">Tanggal</Text>
			<Input
				type="date"
				fontSize="sm"
				value={newData.createdAt}
				onChange={(e) => setNewData({ ...newData, createdAt: e.target.value })}
				mb="8px"
			/>

			<Text mb="4px">Kategori</Text>
			<Dropdown
				isMultiple
				options={availableCategories}
				value={selectedCategories}
				onChange={handleCategories}
			/>

			<Text mt="16px" mb="4px">Buku Catatan</Text>
			<Dropdown
				isMultiple={false}
				options={availableBooks}
				value={selectedBook}
				onChange={handleBookChange}
			/>
		</VStack>
	);
};

export default ManualForm;
