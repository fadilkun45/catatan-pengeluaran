import { HStack, Spacer, Text, useDisclosure } from '@chakra-ui/react'
import { SheetSettings, SheetStatus } from './SheetSync'

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
   <HStack w="full" px="3" mb="19px" position="sticky" top="0" py="3" background="green.400" zIndex="2">
    <Text fontSize="xl" fontWeight="bold" color="white" >Pencatat Pengeluaran</Text>
    <Spacer />
    <SheetStatus onClick={onOpen} />
    {isOpen && <SheetSettings isOpen onClose={onClose} />}
   </HStack>
  )
}
