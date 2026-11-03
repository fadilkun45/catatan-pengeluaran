import { ResponsivePie } from '@nivo/pie';
import { HelperFunction } from '../lib/HelperFunc';
import { useEffect, useState } from 'react';


const PieChart = ({ data }: { data: any }) => {

  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const temp = []
    data?.map((x) => {
      if(x?.value > 0){
        temp.push(x)
      }
    })
    setFilteredData(temp)
  },[data])

  return (
    <>
      <ResponsivePie
        data={filteredData}
        colors={{ datum: 'data.color' }}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        innerRadius={0.5}
        tooltip={({ datum }) => {
          return (
            <div
              style={{
                background: 'white',
                padding: '9px 12px',
                border: '1px solid #ccc',
              }}
            >
              <div>
                {' '}
                {datum.data.id} : {HelperFunction.FormatToRupiah(datum.data.value)}{' '}
              </div>
            </div>
          );
        }}
        enableArcLabels={false}
        arcLabelsTextColor={{ from: 'background', modifiers: [['brighter', 2]] }}
        padAngle={0.7}
        cornerRadius={1}
        activeOuterRadiusOffset={8}
        // colors={[theme.colors.green['300'], theme.colors.green['400'], theme.colors.green['500'], theme.colors.green['600']]}
        borderWidth={1}
        // borderColor={{
        //   from: 'color',
        //   modifiers: [['darker', 0.2]],
        // }}
        // arcLinkLabelsSkipAngle={10}
        // arcLinkLabelsTextColor="#333333"
        // arcLinkLabelsThickness={2}
        // arcLinkLabelsColor={{ from: 'color' }}
        // arcLabelsSkipAngle={10}
        enableArcLinkLabels={false}
      
      // arcLabelsTextColor={{
      //   from: 'color',
      //   modifiers: [['darker', 2]],
      // }}
      // legends={[
      //   {
      //     anchor: 'bottom',
      //     direction: 'column',
      //     justify: false,
      //     translateX: -130,
      //     translateY: 60,
      //     itemsSpacing: 4,
      //     itemWidth: 100,
      //     itemHeight: 18,
      //     itemTextColor: '#999',
      //     itemOpacity: 1,
      //     symbolSize: 18,
      //     symbolShape: 'circle',
      //     // effects: [
      //     //     {
      //     //         on: 'hover',
      //     //         style: {
      //     //             itemTextColor: '#000'
      //     //         }
      //     //     }
      //     // ]
      //   },
      // ]}
      />
    </>
  );
};

export default PieChart;
