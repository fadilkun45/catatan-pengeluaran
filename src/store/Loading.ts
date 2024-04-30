import { create } from 'zustand'

interface LoadingStore {
    isLoading: boolean
    setLoading: (parms: boolean) => void
}

export const useLoadingStore = create<LoadingStore>((set) =>({
    isLoading: false,
    setLoading: (state) =>  set({isLoading: state})
}))