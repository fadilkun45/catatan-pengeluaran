export interface CategoriesLogType {
    id?: number,
    createdAt: string,
    name: string,
    desc: string,
    labelColor: string,
    labelTextColor:string,
    [key: string]: any,
    isSpecialCategories?: boolean,
    bookId?: string
}