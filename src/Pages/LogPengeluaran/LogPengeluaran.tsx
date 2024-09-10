import { Badge, Box, Button, Divider, HStack, Icon, Input, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiTrash, BiX } from "react-icons/bi"
import { PengeluaranLogType } from "../../Types/PengeluaranLog"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db/db"
import dayjs from "dayjs"
import { PengeluaranListLogType } from "../../Types/PengeluaranListLog"
import { HelperFunction } from "../../lib/HelperFunc"
import { DetailAllLogType } from "../../Types/DetailAllLog"
import { DetailLog } from "../../components/DetailLog"
import * as XLSX from 'xlsx';

const LogPengeluaran = () => {
    const [date, setDate] = useState<{
        firstDate: string,
        lastDate: string
    }>({
        firstDate: dayjs().format("YYYY-MM-DD"),
        lastDate: dayjs().format("YYYY-MM-DD")
    })
    const [logTrx, setLogTrx] = useState<PengeluaranListLogType[]>([])
    const [informationDetail, setInformationDetail] = useState<DetailAllLogType>({
        totalLog: 0,
        totalAmount: 0
    })

    const items = useLiveQuery(() => {

        const result = db.pengeluaranLogs.where('createdAt').between(date.firstDate, date.lastDate, true, true).toArray()
        return result
    },
        [date.firstDate, date.lastDate])


    useEffect(() => {

        const temp1: PengeluaranListLogType[] = []
        let temp2: DetailAllLogType = {
            totalLog: 0,
            totalAmount: 0,
        }

        items?.map((y) => {

            temp2 = {
                totalLog: items.length,
                totalAmount: temp2.totalAmount + y.amount
            }

            if (temp1.filter((x) => x.date === y.createdAt).length === 0) {
                temp1.push({
                    date: y.createdAt,
                    amount: y.amount,
                    data: items?.filter((t) => t.createdAt === y.createdAt)
                })
            } else {
                const index = temp1.findIndex(item => item.date === y.createdAt);
                const existData = temp1[index]
                existData.amount += y.amount
                temp1[index] = existData
            }
        })

        setLogTrx(temp1)
        setInformationDetail(temp2)

    }, [items])


    const exportData = (type?: string) => {
    
        if(!items) return

        const wsData = [
          ['Catatan Pengeluaran'],
          ['periode', `${dayjs(date.firstDate).format("DD/MM/YYYY")} - ${dayjs(date.lastDate).format("DD/MM/YYYY")}`],
          ['Tanggal', 'Nama', 'Jumlah'],
          ...items.map((item) => [item.createdAt, item.name, HelperFunction.FormatToRupiah2(item.amount)])
        ];

        wsData.push(
            ['Total', '',  HelperFunction.FormatToRupiah2(informationDetail.totalAmount) ],
        )

        
        const ws:  XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

        // Merge cells for title
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
          { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
        ];
    
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pengeluaran');    
        
        XLSX.writeFile(wb, `catatan pengeluaran ${dayjs(date.firstDate).format("DD-MM-YYYY")}/${dayjs(date.lastDate).format("DD-MM-YYYY")}.xlsx`);
        }


    return (
        <>

            <VStack w={"full"}>
                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">Pilih Range waktu</Text>
                    <HStack w="full" mb="13px">
                        <Box w="49%" >
                            <Text mb="4px" fontSize="sm">Tanggal Awal</Text>
                            <Input type="date" value={date.firstDate} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setDate({ ...date, 'firstDate': v.target.value })} />
                        </Box>
                        <Box w="49%">
                            <Text mb="4px" fontSize="sm"> Tanggal Akhir</Text>
                            <Input type="date" value={date.lastDate} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setDate({ ...date, 'lastDate': v.target.value })} />
                        </Box>
                    </HStack>
                </VStack>

                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">Export Data</Text>
                    <HStack>
                        <Button onClick={() => exportData()} >Export</Button>
                    </HStack>
                </VStack>

                <HStack w="full">
                    <VStack background="green.400" color="white" px="6px" borderRadius="6px" py="6px">
                        <Text fontSize="29px" fontWeight="bold">{informationDetail?.totalLog}</Text>
                        <Text fontSize="md" >Catatan</Text>
                    </VStack>
                    <VStack background="green.400" flex="2" color="white" px="6px" borderRadius="6px" py="6px">
                        <Text w="95%" fontSize="29px" fontWeight="bold">{HelperFunction.FormatToRupiah(informationDetail?.totalAmount)}</Text>
                        <Text w="95%" fontSize="md" >Total transaksi</Text>
                    </VStack>
                </HStack>

                {
                    logTrx?.map((item, key) => (
                        <VStack w="full" mt="10px" key={key}>
                            <Divider />

                            <VStack mb="10px" w="full">
                                <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white">
                                    <Box >
                                        <Text fontSize="29px" fontWeight="bold">{dayjs(item?.date).format("DD")}</Text>
                                        <Text fontSize="16px" >{dayjs(item?.date).format("MMMM, YYYY")}</Text>
                                    </Box>
                                    <Spacer />
                                    <Box >
                                        <Text fontSize="20px" fontWeight="bold">{HelperFunction.FormatToRupiah(item?.amount)}</Text>
                                    </Box>
                                </HStack>

                                {
                                    item?.data?.map((details) => (
                                        <DetailLog  item={details}/>
                                    ))
                                }

                            </VStack>

                        </VStack>
                    ))
                }



            </VStack>
        </>
    )
}

export default LogPengeluaran