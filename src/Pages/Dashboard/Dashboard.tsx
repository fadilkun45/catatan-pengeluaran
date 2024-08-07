import { Box, Select, Text, VStack } from "@chakra-ui/react"
import LineChart from '../../components/LineChart'
import PieChart from "../../components/PieChart"
import { useEffect, useState } from "react"
import { useLoadingStore } from "../../store/Loading"

export const Dashboard = () => {
    const [isrendered, setIsrendered] = useState(false)
    const setLoading = useLoadingStore((state) => state.setLoading)


    useEffect(() => {
        setLoading(true)
        setTimeout(() =>  {setIsrendered(true);setLoading(false)}, 1000)
    },[])

    return (
        <VStack w={"full"} >
            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">Pengeluaran hari ini :</Text>
                <Text fontSize="25px" fontWeight="bold" color="gray.600" >Rp. 80.000</Text>
            </Box>
            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">rentang waktu berdasarkan</Text>
                <Select fontSize="14px" mt={"8px"} h="29px">
                <option value='option3'>1 minggu</option>
                <option value='option3'>1 bulan</option>
                    <option value='option1' selected>6 bulan</option>
                    <option value='option2'>1 Tahun</option>
                </Select>
            </Box>

            <Box w={"90%"} height={"50vh"} mb="8px">
               {isrendered ? <LineChart /> : null } 
            </Box>

            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">Total berdasarkan kategori</Text>
            </Box>
            <Box w={"100%"} height={"65vh"} mb="8px">
            {isrendered ? <PieChart /> : null } 
            </Box>

        </VStack>
    )
}
