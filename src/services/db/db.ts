import Dexie, {type EntityTable} from "dexie";
import { PengeluaranLogType  } from "../../Types/PengeluaranLog";
import { CategoriesLogType } from "../../Types/CategoriesLog";
import { BookLogsType } from "../../Types/BookLogs";

export const db = new Dexie('pengeluaran') as Dexie & {
    pengeluaranLogs: EntityTable<PengeluaranLogType, 'id'>,
    categoriesLog: EntityTable<CategoriesLogType, 'id'>,
    books: EntityTable<BookLogsType, 'id'>
};

db.version(2).stores({
    pengeluaranLogs: '++id, createdAt, name, amount, categoriesId, isSpecialCategories, bookId',
    categoriesLog: '++id, createdAt, name, desc, labelColor, labelTextColor, isSpecialCategories, bookId',
    books: '++id, name, createdAt',
  }).upgrade((trans) => {
  return Promise.all([
    trans.table('pengeluaranLogs').toCollection().modify((item) => {
      item.bookId ??= 'default';
    }),
    trans.table('categoriesLog').toCollection().modify((item) => {
      item.bookId ??= 'default';
    })
  ]);
});

