import { Badge, HStack } from '@chakra-ui/react';
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
        margin={{ top: 40, right: window.screen.availWidth >= 1280 ? 80 : 40, bottom: 60, left: window.screen.availWidth >= 1280 ? 80 : 40 }}
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
      <HStack marginTop={["-100px", "-30px"]} justifyContent="center"  wrap="wrap">
        {
          filteredData?.map((x) => {
              return <Badge px="3" py="3px" color={x?.colorText} background={x?.color} rounded="full">{x?.id}</Badge>
          })
        }
      </HStack>
    </>
  );
};

export default PieChart;
