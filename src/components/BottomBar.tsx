import { Container, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { FiBookmark, FiList, FiMenu, FiPlus } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'


export const BottomBar = () => {

    const navigate = useNavigate()

    return (
        <Container px="0" display="flex"  border="1px solid black" position="fixed" background="#FFFF" bottom="0" zIndex="1" >
            <HStack w={"full"}>
                <VStack w={"5xl"} onClick={() => navigate("/")} color={window.location.pathname === "/" ? "white" : "black"} background={window.location.pathname === "/" ? "green.400" : ""} py="2" px="3">
                    <Icon h="8" w="8" as={HiHome} />
                    <Text fontSize="12px">Home</Text>
                </VStack>

                <VStack w={"5xl"} py="2" px="3" onClick={() => navigate("/kategori")} color={window.location.pathname === "/kategori" ? "white" : ""} background={window.location.pathname === "/kategori" ? "green.400" : ""}>
                    <Icon h="8" w="8" as={FiList} />
                    <Text fontSize="12px">kategori</Text>
                </VStack>


                <VStack w={"5xl"} marginTop="-36px" mx="6px"  backgroundColor="green.400" rounded="full">
                    <Icon h="16 " w="16 " as={FiPlus} color="white"/>
                </VStack>



                <VStack w={"5xl"} py="2" px="3">
                    <Icon h="8" w="8" as={FiBookmark} />
                    <Text fontSize="12px">Log</Text>
                </VStack>



                <VStack w={"5xl"} py="2" px="3">
                    <Icon h="8" w="8" as={FiMenu} />
                    <Text fontSize="12px">Profile</Text>
                </VStack>

            </HStack>


        </Container>
    )
}
