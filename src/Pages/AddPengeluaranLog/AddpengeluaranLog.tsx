import { Badge, Box, Button, Divider, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Text, Textarea, VStack, useDisclosure, useToast } from "@chakra-ui/react"
import { ModalAlert } from "../../components/ModalAlert"
import { ChangeEvent, useState } from "react"
import { FiTrash, FiX } from "react-icons/fi"


interface modalAlertProps {
    modalOpen: boolean,
    modalClose: () => void,
}

export const AddPengeluaranLog = ({ modalOpen, modalClose }: modalAlertProps) => {
    const toast = useToast()
    const { isOpen: modalSuccessAdd, onOpen: modalSuccessAddOpen, onClose: modalSuccessAddClose } = useDisclosure()
    const { isOpen: modalConfirm, onOpen: modalConfirmOpen, onClose: modalConfirmClose } = useDisclosure()
    const [dropdownVal, setDropdownVal] = useState('')
    const [kategoriData, setKategoriData] = useState<string[]>([])

    const handleAddkategori = (e: React.ChangeEvent<HTMLSelectElement>) => {

        if (kategoriData.filter((x) => x === e.target.value).length !== 0) {
            setDropdownVal('')
            toast({
                title: "Kategori sudah ditambahkan",
                colorScheme: "yellow",
                position: "top-right"
            })
            return
        }

        setKategoriData([
            ...kategoriData, e.target.value
        ])
        setDropdownVal('')
    }

    const handleDeleteKategori = (e: string) => {
        setKategoriData(
            kategoriData.filter((x) => e !== x)
        )
        setDropdownVal('')
    }


    console.log("kategori", kategoriData)


    return (
        <>
            <ModalAlert title="Success" subtitle="Tambah catatan pengeluaran berhasil" modalOpen={modalSuccessAdd} modalClose={() => {modalSuccessAddClose();modalClose()}} />

            <Modal isOpen={modalConfirm} onClose={() => modalConfirmClose()}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tambah Kategori</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Anda yakin ingin menyimpan kategori berikut ?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={() => modalConfirmClose()}>
                            Tidak
                        </Button>
                        <Button colorScheme="green" onClick={() => { modalConfirmClose();modalSuccessAddOpen()}}>Ya</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={modalOpen} onClose={() => modalClose()}>
                <ModalOverlay />
                <ModalContent>

                    <ModalHeader>Tambah Catatan Pengeluaran</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack w="full">
                            <Text w="full" mb="4px">Nama Pengeluaran</Text>
                            <Input fontSize="sm" name="" mb="8px" w="full" />
                            <Text w="full" mb="4px">Total pengeluaran</Text>
                            <Input fontSize="sm" name="" mb="8px" w="full" />
                            <Text w="full" mb="4px">Tanggal</Text>
                            <Input fontSize="sm" type="date" name="" mb="8px" w="full" />

                            <Text w="full" mb="4px">Kategori</Text>
                            <Select value={dropdownVal} fontSize="14px" placeholder="pilih kategori" onChange={(e) => handleAddkategori(e)}>
                                <option value='makanan'>Makanan</option>
                                <option value='minuman'>minuman</option>
                                <option value='jajanan' >jajanan</option>
                            </Select>

                            <VStack w="full" mt="8px">
                                {/* {kategoriData.length > 0 ? <Text fontWeight="bold">List Kategori</Text> : ""} */}
                                {/* {
                                    kategoriData.map((x) => (
                                        <HStack bg="green.500" mt="8px" px="4" py='2' borderRadius="5" textColor="white" w="full">
                                            <VStack w="50%" >
                                                <Text w="full" fontSize={{ 'base': "12px", 'md': "sm" }} whiteSpace="nowrap">Pengeluaran hari ini di kategori</Text>
                                                <Text w="full" fontSize={{ 'base': "15px", 'md': "lg" }} mt="-8px" fontWeight="bold" >{x}</Text>
                                                <Text w="full" fontSize={{ 'base': "18px", 'md': "xl" }} mt="-8px" whiteSpace="nowrap">Rp. 80.000</Text>
                                            </VStack>
                                            <Spacer />
                                            <Icon color="white" fontSize="22px" onClick={(e) => handleDeleteKategori(x)} as={FiX} />
                                        </HStack>
                                    ))
                                } */}
                            </VStack>

                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="gray" mr="12px" onClick={() => modalClose()}>tutup</Button>
                        <Button colorScheme="green" onClick={() => {modalConfirmOpen()}}>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}
