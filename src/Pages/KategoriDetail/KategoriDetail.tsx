import { Badge, Box, Button, Divider, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure, useToast } from "@chakra-ui/react"
import { FiSettings } from "react-icons/fi"
import { ModalAlert } from "../../components/ModalAlert"
import { useLoadingStore } from "../../store/Loading"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db/db"
import {useSearchParams } from "react-router-dom"
import { HelperFunction } from "../../lib/HelperFunc"
import { PengeluaranListLogType } from "../../Types/PengeluaranListLog"
import { DetailAllLogType } from "../../Types/DetailAllLog"
import { DetailLog } from "../../components/DetailLog"
import { CategoriesLogType } from "../../Types/CategoriesLog"


const KategoriDetail = () => {
    const { isOpen: modalSettings, onOpen: modalSettingsOpen, onClose: modalSettingsClose } = useDisclosure()
    const { isOpen: modalSettingsSuccess, onOpen: modalSettingsSuccessOpen, onClose: modalSettingsSuccessClose } = useDisclosure()
    const setLoading = useLoadingStore((state) => state.setLoading);
    const toast = useToast()
    const [date, setDate] = useState<{
        firstDate: string;
        lastDate: string;
    }>({
        firstDate: dayjs().format('YYYY-MM-DD'),
        lastDate: dayjs().format('YYYY-MM-DD'),
    });
    const [searchParams] = useSearchParams();
    const [logTrx, setLogTrx] = useState<PengeluaranListLogType[]>([]);
    const [informationDetail, setInformationDetail] = useState<DetailAllLogType>({
        totalLog: 0,
        totalAmount: 0,
    });
    const [editCategory, setEditCategory] = useState<CategoriesLogType>({
        createdAt: dayjs().format("YYYY-MM-DD"),
        name: '',
        desc: '',
        labelColor: '',
        labelTextColor: ''
      })

    const category = useLiveQuery(() => {
        setLoading(true)
        const id = parseInt(searchParams.get("id"))
        const result = db.categoriesLog.get(id)
            setLoading(false)
            return result;
    }, []);

    const items = useLiveQuery(() => {
        setLoading(true)
        const query = db.pengeluaranLogs.where('createdAt').between(date.firstDate, date.lastDate, true, true)
            const result = query.filter(item => item?.categoriesId?.includes(category?.id)).toArray();
            setLoading(false)
            return result;
    }, [date.firstDate, date.lastDate, category]);
    
    useEffect(() => {
        setLoading(true)
        const temp1: PengeluaranListLogType[] = [];
        let temp2: DetailAllLogType = {
            totalLog: 0,
            totalAmount: 0,
        };

        items?.map((y) => {
            temp2 = {
                totalLog: items.length,
                totalAmount: temp2.totalAmount + y.amount,
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
        setEditCategory(category)
        setLoading(false)
    }, [items]);


    const handleEdit = () => {
        if(!category.id) return
        
        try {
          void db.categoriesLog.update(category.id, { ...editCategory, labelColor: category.labelColor, labelTextColor: category.labelTextColor })
          modalSettingsClose(); modalSettingsSuccessOpen()
        } catch (error) {
          toast({
            'colorScheme': "red",
            'title': "error log Edit category",
            'position': 'top-right'
          })
        }
      }
    
    return (
        <>
            <Modal isOpen={modalSettings} onClose={() => modalSettingsClose()}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings Kategori</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack w="full" >
                            <Text w="full" mb="4px" >Nama Kategori</Text>
                            <Input fontSize="sm" value={editCategory?.name} onChange={(v) => setEditCategory({ ...editCategory, name: v.target.value })}  name="" mb="8px" w="full" />
                            <Text w="full" mb="4px" >Deksripsi Kategori</Text>
                            <Textarea fontSize="sm" value={editCategory?.desc} onChange={(v) => setEditCategory({ ...editCategory, desc: v.target.value })} name="" mb="8px" w="full" />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={() => modalSettingsClose()}>
                            Batal
                        </Button>
                        <Button colorScheme="green" onClick={handleEdit}>Edit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ModalAlert modalClose={modalSettingsSuccessClose} modalOpen={modalSettingsSuccess} title="sukses" subtitle="setings kategori berhasil" />

            <VStack w={"full"} >
                <VStack alignItems="start" color={category?.labelTextColor || "white"} backgroundColor={category?.labelColor}  w="full" px="10px" py="10px" borderRadius="7px">
                    <HStack w="full">
                        <Text fontWeight="bold" fontSize="18px">Deksripsi</Text>
                        <Spacer />
                        <Text fontWeight="bold" fontSize="24px">{category?.name}</Text>
                    </HStack>
                    <Text fontSize="13px" my="8px">
                        {category?.desc}
                    </Text>
                    <HStack>
                        <Button onClick={modalSettingsOpen}>settings</Button>
                    </HStack>
                </VStack>

                <Divider my="5" borderColor="green.400" />

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
                    <VStack w="full" mt="10px" key={key}>
                        <Divider />

                        <VStack mb="10px" w="full">
                            <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white">
                                <Box>
                                    <Text fontSize="29px" fontWeight="bold">
                                        {dayjs(item?.date).format('DD')}
                                    </Text>
                                    <Text fontSize="16px">{dayjs(item?.date).format('MMMM, YYYY')}</Text>
                                </Box>
                                <Spacer />
                                <Box>
                                    <Text fontSize="20px" fontWeight="bold">
                                        {HelperFunction.FormatToRupiah(item?.amount)}
                                    </Text>
                                </Box>


                            </HStack>

                            {item?.data?.map((details) => (
                                <DetailLog item={details} />
                            ))}
                        </VStack>
                    </VStack>
                ))}

            </VStack>
        </>
    )
}

export default KategoriDetail