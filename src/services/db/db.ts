import Dexie, {type EntityTable} from "dexie";
import { PengeluaranLogType  } from "../../Types/PengeluaranLog";
import { CategoriesLogType } from "../../Types/CategoriesLog";

export const db = new Dexie('pengeluaran') as Dexie & {
    pengeluaranLogs: EntityTable<PengeluaranLogType, 'id'>,
    categoriesLog: EntityTable<CategoriesLogType, 'id'>
};

db.version(1).stores({
    pengeluaranLogs: '++id, createdAt, name, amount, categoriesId',
    categoriesLog: '++id, createdAt, name, desc, labelColor,labelTextColor'
  });

