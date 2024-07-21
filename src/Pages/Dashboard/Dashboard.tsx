import { Box, Divider, HStack, Input, Select, Text, VStack } from "@chakra-ui/react"
import LineChart from '../../components/LineChart'
import { useEffect, useState } from "react"
import { useLoadingStore } from "../../store/Loading"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db/db"
import dayjs from "dayjs"
import { HelperFunction } from "../../lib/HelperFunc"
import { PengeluaranLogChartType } from "../../Types/ChartPengeluaranLog"
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday)

export const Dashboard = () => {
    const [isrendered, setIsrendered] = useState(false)
    const setLoading = useLoadingStore((state) => state.setLoading)
    const [chartPengeluaranLog, setChartPengeluaranLog] = useState<PengeluaranLogChartType[]>([])
    const [selectDate, setSelectDate] = useState<{
        firstDate: string,
        lastDate: string
    }>({
        firstDate: dayjs(dayjs().day(1)).format("YYYY-MM-DD"),
        lastDate: dayjs(dayjs().day(7)).format("YYYY-MM-DD")
    })

    const currentExpense = useLiveQuery(() => {

        const result = db.pengeluaranLogs.where('createdAt').between(dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"), true, true).toArray().then(transaction => transaction.reduce((total, transaction) => total + transaction.amount, 0));
        return result
    }, [])

    const perWeek = useLiveQuery(() => {
        const results = db.pengeluaranLogs.where('createdAt').between(selectDate.firstDate,selectDate.lastDate , true, true).toArray();
        return results
    }, [selectDate])
    
    useEffect(() => {

        const temp: PengeluaranLogChartType[] = []
       

        perWeek?.map((y) => {

            if (temp.filter((x) => x.date === y.createdAt).length === 0) {
                temp.push({
                    date: y.createdAt,
                    total: y.amount,
                })
            } else {
                const index = temp.findIndex(item => item.date === y.createdAt);
                const existData = temp[index]
                existData.total += y.amount
                temp[index] = existData
            }
        })

        setChartPengeluaranLog(temp)
        console.log(temp)

    }, [perWeek])
    




    useEffect(() => {
        setLoading(true)
        setTimeout(() => { setIsrendered(true); setLoading(false) }, 500)
    }, [])

    return (
        <VStack w={"full"} >
            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">Pengeluaran hari ini :</Text>
                <Text fontSize="25px" fontWeight="bold" color="gray.600" >{HelperFunction.FormatToRupiah(currentExpense || 0)}</Text>
            </Box>
            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">Statistik pengeluaran dalam 1 minggu</Text>
                <Divider mt="12px" py="2px" />
                <HStack w="full" mt="13px">
                        <Box w="49%" >
                            <Text mb="4px" fontSize="sm">Tanggal Awal</Text>
                            <Input type="date" value={selectDate.firstDate} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setSelectDate({ ...selectDate, 'firstDate': dayjs(v.target.value).format("YYYY-MM-DD"), lastDate: dayjs(dayjs(v.target.value).day(7)).format("YYYY-MM-DD")  })} />
                        </Box>
                        <Box w="49%">
                            <Text mb="4px" fontSize="sm"> Tanggal Akhir</Text>
                            <Input type="date" min={selectDate.firstDate} max={dayjs(dayjs(selectDate.firstDate).day(7)).format("YYYY-MM-DD")} value={selectDate.lastDate} onChange={(v: React.ChangeEvent<HTMLInputElement>) => setSelectDate({ ...selectDate, 'lastDate': dayjs(v.target.value).format("YYYY-MM-DD") })} />
                        </Box>
                    </HStack>
            </Box>

            <Box w={"90%"} height={"50vh"} mb="8px">
                {isrendered ? <LineChart data={chartPengeluaranLog} /> : null}
            </Box>
            {/* 
            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">Total berdasarkan kategori</Text>
            </Box> */}

            {/* <Box w={"100%"} height={"65vh"} mb="8px">
            {isrendered ? <PieChart /> : null } 
            </Box> */}

        </VStack>
    )
}
