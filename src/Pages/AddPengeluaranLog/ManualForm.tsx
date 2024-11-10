import React, { useEffect, useState } from 'react';
import { HStack, Input, Text, VStack } from '@chakra-ui/react';
import { HelperFunction } from '../../lib/HelperFunc';
import { Dropdown } from '../../components/Dropdown';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';
import { OptionsType } from '../../Types/OptionType';

const ManualForm = ({setNewData,newData,handleCategories,selectedCategories}: {setNewData: (parms: any) => void; handleCategories: (parms: any) => void;  newData: any ; selectedCategories: any}) => {
	const [availableOptions, setAvailableOptions] = useState<OptionsType[]>([]);
	const categories = useLiveQuery(() => {
		const result = db.categoriesLog.toArray();
		return result;
	}, []);

	useEffect(() => {
		const format = HelperFunction.FormatOptions(categories as unknown[], 'name', 'id');
		setAvailableOptions(format);
	}, [categories]);


	return (
		<VStack w="full">
			<Text w="full" mb="4px">
				Nama Pengeluaran
			</Text>
			<Input value={newData?.name} fontSize="sm" onChange={(v: React.ChangeEvent<HTMLInputElement>) => setNewData({ ...newData, name: v.target.value })} mb="8px" w="full" />
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
				<Dropdown isMultiple options={availableOptions} onChange={handleCategories} value={selectedCategories} />
			</HStack>
		</VStack>
	);
};

export default ManualForm;
