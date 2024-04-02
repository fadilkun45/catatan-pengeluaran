import { Box, Button, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack } from "@chakra-ui/react"
import { FiTrash } from "react-icons/fi"
import { useNavigate } from "react-router-dom"


export interface ListKategori {
    nama: string,
  
}

export const BoxList = ({ item, onDelete }: { item: ListKategori, onDelete?: () => void }) => {
    const navigate = useNavigate()
    
    const onNavigate = () => {
        navigate(`/kategori-detail?id=1`)
    }

    return (
        <>
            <Box cursor="pointer" pr="13px"  display="flex" alignItems="center" w="full"  mb="13px" borderRadius="5px"  background="green.400" color="white">
               <Box  py={"20px"} px="13px" onClick={onNavigate} w="full"  h="full">
               <Text fontSize="22px" fontWeight="bold">{item.nama}</Text>
               </Box>
                <Button px="4" py="4" onClick={onDelete} ><Icon  as={FiTrash} /></Button>
            </Box>
        </>
    )
}
