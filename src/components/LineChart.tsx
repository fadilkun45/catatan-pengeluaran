import { ResponsiveBar } from '@nivo/bar'
import { HelperFunction } from '../lib/HelperFunc'
import { PengeluaranLogChartType } from '../Types/ChartPengeluaranLog'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useToken } from '@chakra-ui/react'


const LineChart = ({ data }: { data: PengeluaranLogChartType[] }) => {
    const [limit] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string)) || 0)
    const [makers, setMakers] = useState([])
    const brand = useToken('colors', 'green.500')

    
    useEffect(() => {
        if(limit > 0){
            setMakers([{
                axis: 'y',
                value: limit,
                lineStyle: {
                    stroke: 'rgba(0, 0, 0, .35)',
                    strokeWidth: 2
                },
                legend: `Limit : ${HelperFunction.FormatToRupiah2(limit)}`,
                legendOrientation: 'horizontal',
            }])
        }
    },[limit])


    return (
        <ResponsiveBar
            data={data.map((x) => ({
                ...x,
                dibawahLimit: Math.min(x.total, limit),
                diatasLimit: Math.max(0, x.total - limit)
            }))}
            keys={['dibawahLimit', 'diatasLimit']}
            markers={makers}
            indexBy="date"
            margin={{ top: 16, right: 8, bottom: 28, left: 44 }}
            padding={0.3}
            innerPadding={1}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            // ()
            colors={({ data, id }) => ( id === "diatasLimit" && limit > 0 ? (((100 * data.total ) / (limit * 2)) > 100 ?   '#E53E3E' : "#D69E2E" ) : brand)} // Set color based on limit
            tooltip={({ data }) => {
                return (
                    <div
                        style={{
                            background: 'white',
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                        }}
                    >
                        <div>{dayjs(data.date).format("DD, MMMM")} : {HelperFunction.FormatToRupiah(data.total )}</div>
                    </div>
                );
            }}
            axisTop={null}
            axisRight={null}
            axisLeft={{ tickValues: 4, format: (v: number) => v >= 1000000 ? `${v / 1000000}jt` : v >= 1000 ? `${v / 1000}rb` : `${v}` }}
            gridYValues={4}
            axisBottom={{
                format: v => dayjs(v).format("ddd")
            }}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            role="application"
            ariaLabel="Nivo bar chart demo"
        />
    );
}

export default LineChart