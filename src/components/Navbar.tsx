import { HStack, Text } from '@chakra-ui/react'

export const Navbar = () => {
  return (
   <HStack w="full" px="3" mb="19px" position="sticky" top="0" py="3" background="green.400">
    <Text fontSize="xl" fontWeight="bold" color="white" >Pencatat Pengeluaran</Text>
   </HStack>
  )
}
