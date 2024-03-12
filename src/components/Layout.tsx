import { Box, Container, VStack } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from './Navbar'
import { BottomBar } from './BottomBar'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout = ({children}: LayoutProps) => {
  return (
    <Container zIndex="3" px="0" w="full" overflowX="hidden" border={"1px solid black"}>
      <Navbar />
      <VStack px="3" w="full" >
      {children}
      </VStack>
      <Box mt="50px"></Box>
      <BottomBar />
      </Container>
  )
}
