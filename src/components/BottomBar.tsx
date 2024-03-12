import { HStack, Icon, Spacer, Text, VStack } from '@chakra-ui/react'
import { FiBookmark, FiList, FiMenu, FiPlusCircle } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'


export const BottomBar = () => {

    const navigate = useNavigate()

    console.log()
    
    return (
        <HStack border="1px solid black" w={"full"} position="fixed" background="#FFFF" bottom="0" zIndex="2" >
            <VStack onClick={() => navigate("/")} background={window.location.pathname === "/" ? "green.400" : ""} py="2" px="3">
                <Icon h="8" w="8" as={HiHome} />
                <Text fontSize="12px">Home</Text>
            </VStack>
            <Spacer />
            <VStack py="2" px="3" onClick={() => navigate("/kategori")} background={window.location.pathname === "/kategori" ? "green.400" : ""}>
                <Icon h="8" w="8" as={FiList} />
                <Text fontSize="12px">kategori</Text>
            </VStack>
            <Spacer />
            <VStack marginTop="-36px" backgroundColor="white" rounded="full">
                <Icon h="20" w="20" as={FiPlusCircle} />
            </VStack>
            <Spacer />
            <VStack py="2" px="3">
                <Icon h="8" w="8" as={FiBookmark} />
                <Text fontSize="12px">Log</Text>
            </VStack>
            <Spacer />
            <VStack py="2" px="3">
                <Icon h="8" w="8" as={FiMenu} />
                <Text fontSize="12px">Profile</Text>
            </VStack>
        </HStack>
    )
}
