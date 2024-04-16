import { Box, Select, Text, VStack } from "@chakra-ui/react"
import LineChart from '../../components/LineChart'
import PieChart from "../../components/PieChart"

export const Dashboard = () => {
    return (
        <VStack w={"full"} >
            <Box w={"full"} mb="12px">
                <Text fontSize="18px" color="gray.600">Pengeluaran hari ini :</Text>
                <Text fontSize="25px" fontWeight="bold" color="gray.600" >Rp. 80.000</Text>
            </Box>
            <Box w={"full"} mb="12px">
                <Text fontSize="14px" color="gray.600">rentang waktu berdasarkan</Text>
                <Select fontSize="14px" mt={"8px"} h="29px">
                <option value='option3'>1 minggu</option>
                <option value='option3'>1 bulan</option>
                    <option value='option1' selected>6 bulan</option>
                    <option value='option2'>1 Tahun</option>
                </Select>
            </Box>

            <Box w={"90%"} height={"50vh"} mb="8px">
               <LineChart />
            </Box>

            <Box w={"full"} mb="12px">
                <Text fontSize="14px" color="gray.600">Total berdasarkan kategori</Text>
            </Box>
            <Box w={"full"} height={"40vh"} mb="8px">
               <PieChart />
            </Box>

        </VStack>
    )
}
