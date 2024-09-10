import Dexie, {type EntityTable} from "dexie";
import { PengeluaranLogType  } from "../../Types/PengeluaranLog";

export const db = new Dexie('pengeluaran') as Dexie & {
    pengeluaranLogs: EntityTable<PengeluaranLogType, 'id'>
};

db.version(1).stores({
    pengeluaranLogs: '++id, createdAt, name, amount, categoriesId'
  });

