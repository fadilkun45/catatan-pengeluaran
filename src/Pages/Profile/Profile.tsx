import { Box, Button, Divider, HStack, Icon, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import Dummny from '../../assets/profile.jpg'
import { IoExitOutline, IoInformation } from 'react-icons/io5'
import { GoDownload } from 'react-icons/go'
import { LiaDonateSolid } from 'react-icons/lia'
import { ModalAlert } from "../../components/ModalAlert"

const Profile = () => {
    const { isOpen: modalConfirmLogout, onOpen: modalConfirmLogoutOpen, onClose: modalConfirmLogoutClose } = useDisclosure()
    const { isOpen: modalConfirmDownload, onOpen: modalConfirmDownloadOpen, onClose: modalConfirmDownloadClose } = useDisclosure()
    const { isOpen: modalAlertDownload, onOpen: modalAlertDownloadOpen, onClose: modalAlertDownloadClose } = useDisclosure()

    const { isOpen: modalAlertLogout, onOpen: modalAlertLogoutOpen, onClose: modalAlertLogoutClose } = useDisclosure()

    return (
        <>
            <ModalAlert modalClose={modalAlertLogoutClose} modalOpen={modalAlertLogout} title="sukses" subtitle="setings kategori berhasil" />


            <Modal isOpen={modalConfirmLogout} onClose={modalConfirmLogoutClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Logout</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Anda yakin ingin keluar ?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={modalConfirmLogoutClose}>
                            Batal
                        </Button>
                        <Button colorScheme="green" onClick={() => { modalConfirmLogoutClose(); modalAlertLogoutOpen() }}>Logout</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ModalAlert modalClose={modalAlertDownloadClose} modalOpen={modalAlertDownload} title="sukses" subtitle="download app berhasil " />
            <Modal isOpen={modalConfirmDownload} onClose={modalConfirmDownloadClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Download App</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>dengan mendownload app ini anda dapat mencatat pengeluaran keuangan dimanapun kapanpun secara offline</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={modalConfirmDownloadClose}>
                            Batal
                        </Button>
                        <Button colorScheme="green" onClick={() => { modalConfirmDownloadClose(); modalAlertDownloadOpen() }}>Download</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <VStack w={"full"}>
                <VStack w="full">
                    <Image src={Dummny} objectFit="cover" loading='eager' mx="auto" my="12px" w="150px" h="150px" border="1px solid" borderColor="green.400" rounded="full" />
                    <Text fontSize="xl" fontWeight="bold">Faldi Ramadhan</Text>
                </VStack>
                <Divider />
                <VStack w="full">


                    <HStack w="full" px="12px" py="6px" onClick={modalConfirmDownloadOpen} cursor="pointer">
                        <Text fontSize="sm">Download</Text>
                        <Spacer />
                        <Icon fontSize="18px" as={GoDownload} />
                    </HStack>
                    <Divider />


                    {/* <HStack w="full" px="12px" py="6px">
                        <Text fontSize="sm">Support US</Text>
                        <Spacer />
                        <Icon fontSize="18px" as={LiaDonateSolid} />
                    </HStack>
                    <Divider /> */}


                    <HStack w="full" px="12px" cursor="pointer" py="6px" onClick={modalConfirmLogoutOpen}>
                        <Text fontSize="sm">Logout</Text>
                        <Spacer />
                        <Icon fontSize="18px" as={IoExitOutline} />
                    </HStack>
                    <Divider />


                    <Text mt="30vh">2024 &copy; Faldi Ramadhan</Text>

                </VStack>
            </VStack>
        </>
    )
}

export default Profile