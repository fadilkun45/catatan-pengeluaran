import { Badge, Box, Button, Divider, HStack, Icon, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import Dummny from '../../assets/profile.jpg'
import { BiChevronRight, BiDownload } from 'react-icons/bi'
import { IoExitOutline, IoInformation } from 'react-icons/io5'
import { FaDownload } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { PiDownloadSimple } from 'react-icons/pi'
import { GoDownload } from 'react-icons/go'
import { FcNightPortrait } from 'react-icons/fc'
import { BsMoon } from 'react-icons/bs'
import { LiaDonateSolid } from 'react-icons/lia'

const Profile = () => {

    return (
        <>

            <VStack w={"full"}>
                <VStack w="full">
                    <Image src={Dummny} objectFit="cover" loading='eager' mx="auto" my="12px" w="150px" h="150px" border="1px solid" borderColor="green.400" rounded="full" />
                    <Text fontSize="xl" fontWeight="bold">Faldi Ramadhan</Text>
                </VStack>
                <Divider />
                <VStack w="full">


                    <HStack w="full" px="12px" py="6px">
                        <Text fontSize="sm">Download</Text>
                        <Spacer />
                        <Icon fontSize="18px" as={GoDownload} />
                    </HStack>
                    <Divider />


                    <HStack w="full" px="12px" py="6px">
                        <Text fontSize="sm">Support US</Text>
                        <Spacer />
                        <Icon fontSize="18px" as={LiaDonateSolid} />
                    </HStack>
                    <Divider />


                    <HStack w="full" px="12px" py="6px">
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