import { Box, Select, Text, VStack } from "@chakra-ui/react"
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

    const currentExpense = useLiveQuery(() => {

        const result = db.pengeluaranLogs.where('createdAt').between(dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"), true, true).toArray().then(transaction => transaction.reduce((total, transaction) => total + transaction.amount, 0));
        return result
    }, [])

    const perWeek = useLiveQuery(() => {
        const results = db.pengeluaranLogs.where('createdAt').between(dayjs(dayjs().day(0)).format("YYYY-MM-DD"), dayjs(dayjs().day(6)).format("YYYY-MM-DD"), true, true).toArray();
        return results
    }, [])
    
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
                {/* <Select fontSize="14px" mt={"8px"} h="29px">
                    <option value='option3'>1 minggu</option>
                </Select> */}
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
