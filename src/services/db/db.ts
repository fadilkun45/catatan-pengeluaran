import Dexie, {type EntityTable} from "dexie";
import { PengeluaranLogType  } from "../../Types/PengeluaranLog";
import { CategoriesLogType } from "../../Types/CategoriesLog";
import { BookLogsType } from "../../Types/BookLogs";
import type { SyncOp } from "../sync";

// crypto.randomUUID only exists on https/localhost; the fallback keeps LAN dev (http://192.168…) working.
export const newId = () => crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)

export const db = new Dexie('pengeluaran') as Dexie & {
    pengeluaranLogs: EntityTable<PengeluaranLogType, 'id'>,
    categoriesLog: EntityTable<CategoriesLogType, 'id'>,
    books: EntityTable<BookLogsType, 'id'>,
    syncQueue: EntityTable<SyncOp & { seq?: number }, 'seq'>,
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

// v3: every log gets a permanent uid (the auto-increment id restarts after a reinstall, so it can't key rows in the Sheet)
// and an outbox for the Sheet. Logs saved with bookId undefined (bug in the old add form) are put back in the default book.
db.version(3).stores({
    pengeluaranLogs: '++id, createdAt, name, amount, categoriesId, isSpecialCategories, bookId, &uid',
    syncQueue: '++seq',
  }).upgrade((trans) =>
    trans.table('pengeluaranLogs').toCollection().modify((item) => {
      item.uid ??= newId();
      item.bookId ??= 'default';
    })
);
