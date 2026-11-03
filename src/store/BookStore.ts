import { create } from 'zustand'
import { BookLogsType } from '../Types/BookLogs'

interface BookStore {
    BookDetail: BookLogsType
    setActiveBooks: (book: BookLogsType) => void
}

export const DEFAULT_BOOK: BookLogsType = { id: 'default', name: 'Buku Utama', createdAt: '2024-01-01' }

const readActive = (): BookLogsType | null => {
    try { return JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_BOOKS) || 'null') as BookLogsType | null } catch { return null }
}

// Falls back to the default book so pages never see null on a fresh install.
export const useBookStore = create<BookStore>((set) => ({
    BookDetail: readActive() ?? DEFAULT_BOOK,
    setActiveBooks: (book) => {
        localStorage.setItem(import.meta.env.VITE_REACT_BOOKS, JSON.stringify(book))
        set({ BookDetail: book })
    },
}))
