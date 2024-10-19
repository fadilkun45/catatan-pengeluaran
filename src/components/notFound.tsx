import { Container, Text } from '@chakra-ui/react'
import React from 'react'

const NotFound = () => {
  return (
   <Container textAlign="center"  alignItems="center" justifyContent="center" height="full" display="flex" flexDirection="column">
        <Text fontSize="5.8rem" fontWeight="bold" color="gray.800">404</Text>
        <Text fontSize="1,6rem" color="gray.600">Data tidak ada</Text>
   </Container>
  )
}

export default NotFound