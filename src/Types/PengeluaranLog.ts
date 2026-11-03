export interface PengeluaranLogType {
    id?: number,
    uid?: string,
    createdAt: string,
    name: string,
    amount: number,
    categoriesId?: [number | string],
    isSpecialCategories?: boolean
    [key: string]: any,
        bookId?: string

}