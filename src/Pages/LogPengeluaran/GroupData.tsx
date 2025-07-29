import { Box, Divider, HStack, Icon, Spacer, Text, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { HelperFunction } from '../../lib/HelperFunc'
import { DetailLog } from '../../components/DetailLog'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

export const GroupData = ({item,key}: {item: any, key: number}) => {
  const [toggle, setToggle] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_TOGGLE as string)))


  return (
    <VStack w="full" mt="10px" key={key}>
    <Divider />

    <VStack mb="10px" w="full">
        <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white" onClick={() => setToggle(!toggle)} cursor="pointer" >
            <Box>
                <Text fontSize="29px" fontWeight="bold">
                    {dayjs(item?.date).format('DD')}
                </Text>
                <Text fontSize="16px">{dayjs(item?.date).format('MMMM, YYYY')}</Text>
            </Box>
            <Spacer />
            <Box justifyItems="flex-end">
                <Text fontSize="20px" fontWeight="bold">
                {HelperFunction.FormatToRupiah(item?.amount)}
                </Text>
                  <Icon as={ toggle ? BiChevronDown : BiChevronUp} textAlign="right" fontSize="40px" />
            </Box>


        </HStack>

        { toggle && item?.data?.map((details) => (
            <DetailLog item={details} />
        ))}
    </VStack>
</VStack>
  )
}
