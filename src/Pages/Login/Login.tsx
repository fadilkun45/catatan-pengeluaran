import { Button, Checkbox, Flex, FormControl, FormLabel, Heading, Image, Input, Stack, Text } from "@chakra-ui/react"

const Login = () => {
    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
          <Flex p={8} flex={1} align={'center'} justify={'center'}>

            <Stack spacing={4} w={'full'} maxW={'md'}>
              <Heading fontSize={'2xl'} textAlign="center">Login dengan akun</Heading>
              <Stack spacing={6}>
                <Button zIndex="5" colorScheme={'green'} variant={'solid'}>
                  Google
                </Button>
              </Stack>
            </Stack>
          </Flex>
          <Flex background="green.400" display={{"base": "none", "lg": "flex"}} flex={1}>
            <Text color="#FFF" style={{'transform': 'rotate(90deg)'}} fontSize="3xl" fontWeight="bold">App pencatat Pengeluaran</Text>
          </Flex>
        </Stack>
      )
}

export default Login