import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import 'dayjs/locale/id'
import dayjs from 'dayjs'
import { db } from './services/db/db'
import { flush } from './services/sync'
import { DEFAULT_BOOK } from './store/BookStore'
import { makeTheme, useThemeStore } from './store/ThemeStore'
import { useMemo } from 'react'

dayjs.locale('id') 

void db.books.get(DEFAULT_BOOK.id).then((b) => { if (!b) return db.books.add(DEFAULT_BOOK) })
// Ask the browser not to evict IndexedDB under storage pressure; this app has no other copy of the data.
void navigator.storage?.persist?.()
void flush() // send whatever was left in the outbox last session

const Root = () => {
    const color = useThemeStore((s) => s.color)
    const theme = useMemo(() => makeTheme(color), [color])
    return (
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)
