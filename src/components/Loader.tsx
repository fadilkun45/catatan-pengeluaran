import { Box } from "@chakra-ui/react"
import { HashLoader } from "react-spinners"

const Loader = () => {
    return (
        <Box position="sticky" zIndex="900" top="0" bottom="0" w="100%" display="flex" justifyContent="center" alignItems={"center"} h="100vh">
            <Box opacity="80%" background="#FFF" w="100%" h="100vh" />
            <HashLoader color="#36d7b7" style={{ opacity: "100%" }} />
        </Box>
    )
}

export default Loader