import { Container, HStack, Icon, Text, VStack, useDisclosure } from '@chakra-ui/react'
import { FiBookmark, FiList, FiMenu, FiPlus } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import {  } from "@chakra-ui/react"
import { AddPengeluaranLog } from '../Pages/AddPengeluaranLog/AddpengeluaranLog'
import { CgProfile } from 'react-icons/cg'


export const BottomBar = () => {
    const { isOpen:addModal, onOpen:addModalOpen, onClose:addModalClose } = useDisclosure()

    const navigate = useNavigate()



    return (
       <>
      {addModal && <AddPengeluaranLog modalClose={addModalClose} modalOpen={addModal} />} 

       <Container px="0" display="flex" boxShadow="-1px -1px 9px 0px rgba(0,0,0,0.29)" position="fixed" background="#FFFF" bottom="0" zIndex="1" >
            <HStack w={"full"}>
                <VStack  w={"5xl"} cursor="pointer" onClick={() => navigate("/")} color={window.location.pathname === "/" ? "white" : "green.400"} background={window.location.pathname === "/dashboard" ? "green.400" : ""} py="2" px="3">
                    <Icon h="8" w="8" as={HiHome} />
                    <Text fontSize="12px">Home</Text>
                </VStack>

                {/* <VStack w={"5xl"} py="2" cursor="pointer" px="3" onClick={() => navigate("/kategori")} color={window.location.pathname === "/kategori" ? "white" : "green.400"} background={window.location.pathname === "/kategori" ? "green.400" : ""}>
                    <Icon h="8" w="8" as={FiList} />
                    <Text fontSize="12px">kategori</Text>
                </VStack> */}


                <VStack  onClick={addModalOpen} cursor="pointer" marginTop="-36px"  backgroundColor="green.400" rounded="full">
                    <Icon h="16 " w="16 " as={FiPlus} color="white"/>
                </VStack>



                <VStack w={"2xl"} py="2" px="3" cursor="pointer" onClick={() => navigate("/log-pengeluaran")}  color={window.location.pathname === "/log-pengeluaran" ? "white" : "green.400"} background={window.location.pathname === "/log-pengeluaran" ? "green.400" : ""}>
                    <Icon h="8" w="8" as={FiBookmark} />
                    <Text fontSize="12px">Log</Text>
                </VStack>



                <VStack w={"2xl"} py="2" cursor="pointer" onClick={() => navigate("/profile")}  px="3" color={window.location.pathname === "/profile" ? "white" : "green.400"} background={window.location.pathname === "/profile" ? "green.400" : ""}>
                    <Icon h="8" w="8" as={CgProfile} />
                    <Text fontSize="12px">options</Text>
                </VStack>

            </HStack>


        </Container>
       </>
    )
}
