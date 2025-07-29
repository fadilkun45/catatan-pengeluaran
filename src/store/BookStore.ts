import { create } from 'zustand'
import { BookLogsType } from '../Types/BookLogs'

interface BookStore {
    BookDetail: BookLogsType | null
    setActiveBooks: (parms: any) => void
}

export const useBookStore = create<BookStore>((set) =>({
    BookDetail: JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_BOOKS) || 'null'),
    setActiveBooks: (state) =>  set({BookDetail: state})
}))