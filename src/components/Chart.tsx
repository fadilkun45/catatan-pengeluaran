
import { Box, Select, Text } from '@chakra-ui/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
import { Bar } from 'react-chartjs-2';

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
            display: false
        },
        title: {
            display: true,
            text: 'History pengeluaran selama 7 hari ini',
        },
    },

};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'augtust', 'september', 'october'];
const Data = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


export const data = {
    labels,
    datasets: [
        {
            // label: `Pengeluaran di bulan `,
            data: labels.map(() => Math.random().toFixed(10)),
            backgroundColor: "blue",
        },
    ],
};

const Chart = () => {
    return <Box w={{ base: '100%', md: "50%" }}>
        <Box mb="19px">
            <Text mb="12px">Pilih Periode</Text>
            <Select placeholder='Select option'>
                <option value='option1' selected> 7 hari terakhir</option>
                <option value='option1'>bulanan</option>
                <option value='option3'>Tahunan</option>
            </Select>
        </Box>
        <Bar options={options} data={data} />
    </Box>
}

export default Chart