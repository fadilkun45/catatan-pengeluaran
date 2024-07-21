import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import 'dayjs/locale/id'
import dayjs from 'dayjs'

dayjs.locale('id') 

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider>
        <App />
    </ChakraProvider>
)
