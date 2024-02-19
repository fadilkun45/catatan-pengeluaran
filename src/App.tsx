import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Welcome } from './Pages/Welcome'
import { Layout } from './components/Layout'

function App() {

  return (
   <ChakraProvider>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><Welcome /></Layout>} />
      </Routes>
    </BrowserRouter>
   </ChakraProvider>
  )
}

export default App
