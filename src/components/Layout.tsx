import { Box, Container, VStack } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from './Navbar'
import { BottomBar } from './BottomBar'
import { useLoadingStore } from '../store/Loading'
import Loader from './Loader'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {

  const loading = useLoadingStore((state) => state.isLoading)


  return (
  <>
  { loading && <Loader />}

  <Container zIndex="3" px="0" w="full" overflowX="hidden" minH="100vh" shadow="-1px -1px 9px 0px rgba(0,0,0,0.29)"
    >
      <Navbar />
      <VStack px="3" w="full" >
        {children}
      </VStack>
      <Box mt="100px"></Box>
      <BottomBar />
    </Container>
  </>
  )
}
