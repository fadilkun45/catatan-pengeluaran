export interface PengeluaranLogType {
    id?: number,
    createdAt: string,
    name: string,
    amount: number,
    categoriesId?: [number | string]
    [key: string]: any
}