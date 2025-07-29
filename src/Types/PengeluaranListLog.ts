import { PengeluaranLogType } from "./PengeluaranLog";

export interface PengeluaranListLogType {
    data: PengeluaranLogType[],
    amount: number,
    date: string
}[]