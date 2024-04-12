import { Badge, Box, Button, Divider, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import { FiSettings } from "react-icons/fi"
import { ModalAlert } from "../../components/ModalAlert"


const KategoriDetail = () => {
    const { isOpen: modalSettings, onOpen: modalSettingsOpen, onClose: modalSettingsClose } = useDisclosure()
    const { isOpen: modalSettingsSuccess, onOpen: modalSettingsSuccessOpen, onClose: modalSettingsSuccessClose } = useDisclosure()



    return (
        <>
            <Modal isOpen={modalSettings} onClose={() => modalSettingsClose()}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings Kategori</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack w="full">
                            <Text w="full" mb="4px">Nama Kategori</Text>
                            <Input fontSize="sm" name="" mb="8px" w="full" />
                            {/* <Text w="full" mb="4px">Limit per hari</Text>
                <Input fontSize="sm" name="" mb="8px" w="full" /> */}
                            <Text w="full" mb="4px">Deksripsi Kategori</Text>
                            <Textarea fontSize="sm" name="" mb="8px" w="full" />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={() => modalSettingsClose()}>
                            Batal
                        </Button>
                        <Button colorScheme="green" onClick={() => { modalSettingsClose(); modalSettingsSuccessOpen() }}>Edit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ModalAlert modalClose={modalSettingsSuccessClose} modalOpen={modalSettingsSuccess} title="sukses" subtitle="setings kategori berhasil" />

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
                        <Button onClick={modalSettingsOpen}>settings</Button>
                    </HStack>
                </VStack>

                <Divider my="5" borderColor="green.400" />

                <VStack w="full">
                    <Text w="full" fontSize="xl" fontWeight="bold">Pilih Range waktu</Text>
                    <HStack w="full" mb="13px">
                        <Box w="full" >
                            <Text  mb="4px" fontSize="sm">Tanggal Awal</Text>
                            <Input type="date" />
                        </Box>
                        <Spacer />
                        <Box w="full">
                            <Text mb="4px" fontSize="sm"> Tanggal Akhir</Text>
                            <Input type="date" />
                        </Box>
                    </HStack>
                </VStack>

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
        </>
    )
}

export default KategoriDetail