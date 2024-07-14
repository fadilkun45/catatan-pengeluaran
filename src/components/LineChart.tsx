import { ResponsiveBar } from '@nivo/bar'
import { HelperFunction } from '../lib/HelperFunc'
import { PengeluaranLogChartType } from '../Types/ChartPengeluaranLog'
import dayjs from 'dayjs'

// const data = [
//     {
//         "date": "januari",
//         "total": 120000,
//     },
//     {
//         "date": "febuari",
//         "total": 100000,
//     },
//     {
//         "date": "maret",
//         "total": 30000,
//     },
//     {
//         "date": "april",
//         "total": 50000,
//     },
//     {
//         "date": "mei",
//         "total": 130000,
//     },
//     {
//         "date": "juni",
//         "total": 125000,
//     },
// ]


const LineChart = ({data}: {data: PengeluaranLogChartType[]}) => {


    return (
        <ResponsiveBar
            data={data}
            keys={[
                'total'
            ]}
            indexBy="date"
            margin={{ top: 50, right: 12, bottom: 50, left: 60 }}
            padding={0.3}
            innerPadding={1}
            // groupMode="grouped"
            animate={false}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={"rgb(56, 161, 105)"}
            tooltip={({data}) => {
                return (
                    <div
                        style={{
                            background: 'white',
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                        }}
                    >

                        <div> {dayjs(data.date).format("DD,MMMM")} : {HelperFunction.FormatToRupiah(data.total as number)} </div>
                    </div>
                )
            }} 
            // defs={[
            //     {
            //         id: 'dots',
            //         type: 'patternDots',
            //         background: 'inherit',
            //         color: '#38bcb2',
            //         size: 4,
            //         padding: 1,
            //         stagger: true
            //     },
            //     {
            //         id: 'lines',
            //         type: 'patternLines',
            //         background: 'inherit',
            //         color: '#eed312',
            //         rotation: -45,
            //         lineWidth: 6,
            //         spacing: 15
            //     }
            // ]}
            // fill={[
            //     {
            //         match: {
            //             id: 'fries'
            //         },
            //         id: 'dots'
            //     },
            //     {
            //         match: {
            //             id: 'sandwich'
            //         },
            //         id: 'lines'
            //     }
            // ]}
            // borderColor={{
            //     from: 'color',
            //     modifiers: [
            //         [
            //             'darker',
            //             '0'
            //         ]
            //     ]
            // }}
            axisTop={null}
            axisRight={null}
            // axisBottom={{
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     legend: 'country',
            //     legendPosition: 'middle',
            //     legendOffset: 32,
            //     truncateTickAt: 0
            // }}
            // axisLeft={{
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     legend: 'food',
            //     legendPosition: 'middle',
            //     legendOffset: -60,
            //     truncateTickAt: 0
            // }}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            // labelTextColor={{
            //     from: 'color',
            //     modifiers: [
            //         [
            //             'darker',
            //             1.6
            //         ]
            //     ]
            // }}
            // legends={[
            //     {
            //         dataFrom: 'keys',
            //         anchor: 'bottom-right',
            //         direction: 'column',
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 100,
            //         itemHeight: 20,
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 0.85,
            //         symbolSize: 20,
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemOpacity: 1
            //                 }
            //             }
            //         ]
            //     }
            // ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
        />
    )
}

export default LineChart