import { Badge, Box, Button, Divider, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import { FiSettings } from "react-icons/fi"


const KategoriDetail = () => {
    return (
        <VStack w={"full"}>
            <VStack alignItems="start" background="green.400" color="#FFFF" w="full" px="10px" py="10px" borderRadius="7px">
                <HStack w="full">
                    <Text fontWeight="bold" fontSize="18px">Deksripsi</Text>
                    <Spacer />
                    <Text fontWeight="bold" fontSize="24px">Rp.25.000</Text>
                </HStack>
                <Text fontSize="13px" my="8px">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat placeat esse in dolor id quidem illo reiciendis aliquid debitis omnis.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, vitae.
                </Text>
                <HStack>
                    <Button>settings</Button>
                </HStack>
            </VStack>

            <Divider my="5" borderColor="green.400" />

            <VStack mb="10px" w="full">
                <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white">
                    <Box >
                        <Text fontSize="29px" fontWeight="bold">20</Text>
                        <Text fontSize="16px" >Januari, 2024</Text>
                    </Box>
                    <Spacer />
                    <Box >
                        <Text fontSize="20px" fontWeight="bold">Rp.25.000</Text>
                    </Box>
                </HStack>

                <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                    <HStack w="full">
                        <Text fontSize={"16px"}>jajan gorengan</Text>
                        <Spacer />
                        <Text fontSize={"16px"}>Rp.20.000</Text>
                    </HStack>
                    <HStack w="full">
                        <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                        <Badge px="3" py="3px" rounded="full" >Makanan</Badge>
                    </HStack>
                </VStack>

                <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                    <HStack w="full">
                        <Text fontSize={"16px"}>Beli air</Text>
                        <Spacer />
                        <Text fontSize={"16px"}>Rp.5.000</Text>
                    </HStack>
                    <HStack w="full">
                        <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                        <Badge px="3" py="3px" rounded="full" >Minuman</Badge>
                    </HStack>
                </VStack>

            </VStack>

        </VStack>
    )
}

export default KategoriDetail