import { VStack } from '@chakra-ui/react'
import React from 'react'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout = ({children}: LayoutProps) => {
  return (
   <VStack w={{'sm': '95%', 'lg': '80%'}} border={'1px solid black'} mx="auto" >{children}</VStack>
  )
}
