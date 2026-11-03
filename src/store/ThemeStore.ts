import { create } from 'zustand'
import { extendTheme, theme as base } from '@chakra-ui/react'

// Tanpa merah: merah dipakai untuk error & lewat limit.
export const THEMES = { green: 'Hijau', teal: 'Teal', cyan: 'Cyan', blue: 'Biru', purple: 'Ungu', pink: 'Pink', orange: 'Oranye' } as const
export type ThemeColor = keyof typeof THEMES

const KEY = 'ThemeColor'

const read = (): ThemeColor => {
    try {
        const v = localStorage.getItem(KEY)
        return v && v in THEMES ? (v as ThemeColor) : 'green'
    } catch {
        return 'green'
    }
}

// Seluruh app memakai palet "green", jadi ganti tema cukup menukar isi palet itu.
export const makeTheme = (c: ThemeColor) => extendTheme({ colors: { green: base.colors[c] } })

export const useThemeStore = create<{ color: ThemeColor, setColor: (c: ThemeColor) => void }>((set) => ({
    color: read(),
    setColor: (color) => {
        try { localStorage.setItem(KEY, color) } catch { /* tetap berlaku sampai reload */ }
        set({ color })
    },
}))
