/* eslint-disable no-mixed-spaces-and-tabs */
import { Button, VStack, useToast, Input, Text, Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { HelperFunction } from '../../lib/HelperFunc';
import cloneDeep from 'lodash.clonedeep';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';
import { Dropdown } from '../../components/Dropdown';
import { OptionsType } from '../../Types/OptionType';
import dayjs from 'dayjs';

const ImageForm = ({ setImageFromData, parentData }: { setImageFromData: (parms: any) => void; parentData: any }) => {
	const toast = useToast();
	const fileInputRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [resultData, setResultData] = useState<any>(null);
	const [availableOptions, setAvailableOptions] = useState<OptionsType[]>([]);
	const [isAvailableFile, setIsAvailableFile] = useState(false);
	const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

	const handleFileSelection = async (event) => {
		const file = event.target.files[0];
		setIsAvailableFile(true);
		if (file) {
			toast({
				position: 'top-right',
				title: 'Gambar berhasil dipilih',
				description: `Memproses file: ${file?.name}`,
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			try {
				setIsLoading(true);
				const result = await Tesseract.recognize(file, 'eng', {
					logger: (m) => console.log(m),
				});

				const lines = result.data.text.trim().split('\n');

				const itemPattern = /^(.*?)(\d+)\s+(\d+),?(\d*)$/;
				const parsedItems = [];

				if (result.data.text.includes('Metode pembayaran')) {
					let name = '';
					let amount = 0;

					lines.forEach((line, index) => {
						const itemPattern = /^(.*?)\s+Rp([\d.,]+)/i;
						const match = itemPattern.exec(line);
						if (index === 3) {
							name = line;
						}
						if (match) {
							amount = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
						}
					});

					if (name && amount) {
						parsedItems.push({
							amount,
							name,
							selectedCategories: [],
							createdAt: dayjs().format('YYYY-MM-DD'),
						});
					}
					
				} else {
					lines.forEach((line) => {
						const match = itemPattern.exec(line);

						// const dateMatch = datePattern.exec(line);
						// if (dateMatch) {
						//   console.log("raw",dateMatch[1].replace(/\s?\./g, '-'))
						//   const split = dateMatch[1].replace(/\s?\./g, '-').split("-")
						// 	setDate(dayjs(split[2] + split[1] + split[0].replace(/\s?\./g, '-')).format('YYYY-MM-DD'));
						// 	console.log('tgl', {
						// 		date: dayjs(split[2] + split[1] + split[0].replace(/\s?\./g, '-')).format('YYYY-MM-DD'), // Format: DD-MM-YY
						// 	});
						// }

						if (match) {
							const name = match[1].trim(); // Nama item
							const amount = parseInt(match[2], 10); // Harga satuan
							parsedItems.push({ amount, name, selectedCategories: [], createdAt: dayjs().format('YYYY-MM-DD') });
						}
					});
				}

				setResultData(parsedItems);

				toast({
					title: 'OCR berhasil',
					description: 'Teks berhasil diekstrak dari gambar.',
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top-right',
				});
			} catch (error) {
				console.error(error);
				toast({
					title: 'OCR gagal',
					description: 'Terjadi kesalahan saat memproses gambar.',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'top-right',
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const categories = useLiveQuery(() => {
		const result = db.categoriesLog.toArray();
		return result;
	}, []);

	useEffect(() => {
		const format = HelperFunction.FormatOptions(categories as unknown[], 'name', 'id');
		setAvailableOptions(format);
	}, [categories]);

	useEffect(() => {
		setImageFromData(resultData);
	}, [resultData, date]);

	const handleFileInputClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const clickDelete = (v) => {
		const cloneArray: any = cloneDeep(resultData);
		cloneArray.splice(v, 1);
		setResultData(cloneArray);
	};

	const handleSelectCategories = (value, index) => {
		const cloneArray: any = cloneDeep(resultData);
		cloneArray[index].selectedCategories = value;
		setResultData(cloneArray);
	};

	const handleChangeInput = (v: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const cloneArray: unknown = cloneDeep(resultData);
		cloneArray[index][v.target.name] = v.target.name === 'amount' ? parseInt(HelperFunction.onlyNumber(v.target.value) || 0) : v.target.value;
		setResultData(cloneArray);
	};

	return (
		<VStack w="full" justifyContent="center" alignItems="center" overflowY="auto" pt="20px" spacing={4}>
			<Button colorScheme="green" onClick={handleFileInputClick} isLoading={isLoading}>
				{isAvailableFile && resultData?.length > 0 ? 'Ganti Foto' : 'pilih Foto'}
			</Button>
			{fileInputRef && <Input onClick={(v) => (v.currentTarget.value = null)} type="file" accept="image/*" ref={fileInputRef} display="none" onChange={handleFileSelection} />}
			{resultData?.length && (
				<Box height="50vh" w="full">
					<Text w="full">Tanggal</Text>
					<Input fontSize="sm" value={date} mt="12px" onChange={(v) => setDate(v.target.value)} type="date" name="createdAt" w="full" />
					{resultData?.map((x, index) => (
						<VStack width="full" alignItems="flex-start" mt="20px" border="1px #4A5568 solid" px="14px" py="12px" rounded="12px">
							<Text width="full" textAlign="left" fontSize="lg">
								Nama
							</Text>
							<Input value={x?.name} name="name" onChange={(v) => handleChangeInput(v, index)} />
							<Text width="full" fontSize="lg" mt="7px">
								Harga
							</Text>
							<Input value={HelperFunction.FormatToRupiah2(x?.amount)} name="amount" onChange={(v) => handleChangeInput(v, index)} />
							<Text w="full" mt="7px" mb="4px">
								Kategori
							</Text>
							<Box w="full">
								<Dropdown isMultiple options={availableOptions} onChange={(v) => handleSelectCategories(v, index)} value={x.selectedCategories} />
							</Box>

							<Button onClick={() => clickDelete(index)} colorScheme="green" mt="12px">
								Hapus
							</Button>
						</VStack>
					))}
				</Box>
			)}
		</VStack>
	);
};

export default ImageForm;
