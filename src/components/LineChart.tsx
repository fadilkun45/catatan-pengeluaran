import { ResponsiveBar } from '@nivo/bar'
import { HelperFunction } from '../lib/HelperFunc'
import { PengeluaranLogChartType } from '../Types/ChartPengeluaranLog'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'


const LineChart = ({ data }: { data: PengeluaranLogChartType[] }) => {
    const [limit] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string)) || 0)
    const [makers, setMakers] = useState([])

    
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
            margin={{ top: 50, right: 12, bottom: 50, left: 60 }}
            padding={0.3}
            innerPadding={1}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            // ()
            colors={({ data, id }) => ( id === "diatasLimit" && limit > 0 ? (((100 * data.total ) / (limit * 2)) > 100 ?   '#E53E3E' : "#D69E2E" ) : 'rgb(56, 161, 105)')} // Set color based on limit
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