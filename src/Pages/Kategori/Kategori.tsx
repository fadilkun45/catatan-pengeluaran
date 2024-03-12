import { Box, Button, Input, Text, Textarea, VStack } from "@chakra-ui/react"

const Kategori = () => {
  return (
    <VStack w={"full"}>
      <Text fontSize="16" mt="10px" fontWeight="bold">Tambah Kategori</Text>
      
      <VStack w={"full"}>
        <Box w="full" mt="3">
          <Text mb="2">Nama Kategori</Text>
          <Input fontSize="14px" variant='outline' placeholder='cth: jajan' />
        </Box>
        <Box w="full" mt="3">
          <Text mb="2">Deskripsi Grup</Text>
          <Textarea  fontSize="14px" variant='outline' placeholder='cth: jajan adalah kebutuhan hidup setelah sandang papan dan pangan' />
        </Box>
        <Button colorScheme="green" w="full" mt="3">submit</Button>
      </VStack>

    </VStack>
  )
}

export default Kategori