import { Box, Divider, HStack, Input, Spacer, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';
import dayjs from 'dayjs';
import { PengeluaranListLogType } from '../../Types/PengeluaranListLog';
import { HelperFunction } from '../../lib/HelperFunc';
import { DetailAllLogType } from '../../Types/DetailAllLog';
import { DetailLog } from '../../components/DetailLog';
import { useLoadingStore } from '../../store/Loading';
import { OptionsType } from '../../Types/OptionType';
import { Dropdown } from '../../components/Dropdown';
import { ExportData } from './ExportData';
import { GroupData } from './GroupData';
const LogPengeluaran = () => {
    const setLoading = useLoadingStore((state) => state.setLoading);
    const [date, setDate] = useState<{
        firstDate: string;
        lastDate: string;
    }>({
        firstDate: dayjs().format('YYYY-MM-DD'),
        lastDate: dayjs().format('YYYY-MM-DD'),
    });
    const [logTrx, setLogTrx] = useState<PengeluaranListLogType[]>([]);
    const [informationDetail, setInformationDetail] = useState<DetailAllLogType>({
        totalLog: 0,
        totalAmount: 0,
    });
    const [selectedCategories, setSelectedCategories] = useState<OptionsType[]>([]);
    const [availableOptions, setAvailableOptions] = useState<OptionsType[]>([]);

    const items = useLiveQuery(async () => {

        setLoading(true)
        const query = db.pengeluaranLogs.where('createdAt').between(date.firstDate, date.lastDate, true, true)


        if (selectedCategories?.length === 1) {
            const result = query.filter(item => item?.categoriesId?.includes(selectedCategories[0].value)).toArray();
            setLoading(false)
            return result;

        } else if (selectedCategories?.length > 1) {

            //  ubah selectedCategories menjadi Array Number ex : [2,3]
            const dataArrCategories = selectedCategories.map(item => item.value);

            // mencari tau apakah dalam data (itemCategories) tersebut ada kategori yang sama atau tidak 
            //  some : mencari persamaan dari hasil data tersebut
            const containsSomeCategories = (itemCategories: string[], selectedCategories: string[]) => {
                return selectedCategories?.some((category) => itemCategories?.includes(category));
            };

            const result = await query.filter(item => containsSomeCategories(item.categoriesId as string[], dataArrCategories as string[])).toArray();

            setLoading(false)
            return result;
        } else {
            const result = query.toArray();
            setLoading(false)
            return result;
        }

    }, [date.firstDate, date.lastDate, selectedCategories]);

    const categories = useLiveQuery(() => {
        const result = db.categoriesLog.toArray();
        return result;
    }, []);

    useEffect(() => {
        const temp1: PengeluaranListLogType[] = [];
        let temp2: DetailAllLogType = {
            totalLog: 0,
            totalAmount: 0,
        };

        items?.map((y) => {
            temp2 = {
                totalLog: items?.length,
                totalAmount: temp2?.totalAmount + y?.amount,
            };

            if (temp1.filter((x) => x.date === y.createdAt).length === 0) {
                temp1.push({
                    date: y.createdAt,
                    amount: y.amount,
                    data: items?.filter((t) => t.createdAt === y.createdAt),
                });
            } else {
                const index = temp1.findIndex((item) => item.date === y.createdAt);
                const existData = temp1[index];
                existData.amount += y.amount;
                temp1[index] = existData;
            }
        });

        setLogTrx(temp1);
        setInformationDetail(temp2);
    }, [items]);

    useEffect(() => {
        const format = HelperFunction.FormatOptions(categories as unknown[], 'name', 'id');
        setAvailableOptions(format);
    }, [categories]);

    const handleAddCategories = (v: OptionsType[]) => {
        setSelectedCategories(v);
    };

    return (
        <>
            <VStack w={'full'}>
                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">
                        Pilih Range waktu
                    </Text>
                    <HStack w="full" mb="13px">
                        <Box w="49%">
                            <Text mb="4px" fontSize="sm">
                                Tanggal Awal
                            </Text>
                            <Input type="date" value={date.firstDate} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setDate({ ...date, firstDate: v.target.value })} />
                        </Box>
                        <Box w="49%">
                            <Text mb="4px" fontSize="sm">
                                {' '}
                                Tanggal Akhir
                            </Text>
                            <Input type="date" value={date.lastDate} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setDate({ ...date, lastDate: v.target.value })} />
                        </Box>
                    </HStack>
                </VStack>

                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">
                        pilih Kategori
                    </Text>
                    <HStack w="full" mb="13px">
                        <Dropdown isMultiple options={availableOptions} onChange={handleAddCategories} value={selectedCategories} />
                    </HStack>
                </VStack>

                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">
                        Export Data
                    </Text>
                    <HStack w="full">
                        <ExportData date={date} items={items} informationDetail={informationDetail} setLoading={setLoading} />
                    </HStack>
                </VStack>

                <HStack w="full">
                    <VStack background="green.400" color="white" px="6px" borderRadius="6px" py="6px">
                        <Text fontSize="29px" fontWeight="bold">
                            {informationDetail?.totalLog}
                        </Text>
                        <Text fontSize="md">Catatan</Text>
                    </VStack>
                    <VStack background="green.400" flex="2" color="white" px="6px" borderRadius="6px" py="6px">
                        <Text w="95%" fontSize="29px" fontWeight="bold">
                            {HelperFunction.FormatToRupiah(informationDetail?.totalAmount)}
                        </Text>
                        <Text w="95%" fontSize="md">
                            Total transaksi
                        </Text>
                    </VStack>
                </HStack>

                {logTrx?.map((item, key) => (
                    <GroupData item={item} key={key} />
                ))}
            </VStack>
        </>
    );
};

export default LogPengeluaran;
