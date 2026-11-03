# Pengeluaranku

PWA pencatat pengeluaran: catat harian, kategori (termasuk kategori spesial yang tidak masuk total harian), beberapa buku catatan, limit harian, grafik mingguan, export Excel. Data disimpan di HP (IndexedDB) jadi bisa dipakai offline, lalu dikirim ke Google Sheet saat online.

```bash
npm install
npm run dev     # pengembangan
npm test        # tes migrasi data & sinkronisasi
npm run build
```

Stack: React 18, Chakra UI, Dexie (IndexedDB), Zustand, vite-plugin-pwa.

## Hubungkan ke Google Sheet

1. Buat Google Sheet baru.
2. Buka **Extensions → Apps Script**, hapus isinya, tempel isi [`apps-script/Code.gs`](apps-script/Code.gs), lalu simpan.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Salin URL yang berakhiran `/exec`.
5. Di app, tekan tombol **Sheet** di kanan atas, tempel URL-nya, lalu **Simpan link**. Semua catatan yang sudah ada langsung dikirim.

Hasilnya masuk ke tab `Pengeluaran` dengan kolom `uid, tanggal, nama, nominal, kategori, buku, spesial`. Untuk rekap, pakai Pivot table di tab lain dan jangan ubah tab `Pengeluaran`.

Cara kerjanya:
- Catatan dan antrean kirimnya disimpan bersamaan di IndexedDB, jadi mencatat tidak pernah menunggu internet dan tidak ada yang hilang saat offline.
- Antrean dikirim saat app dibuka, saat kembali online, saat app dibuka lagi dari background, dan langsung setelah mencatat. Titik di tombol **Sheet**: putih = semua terkirim, kuning = ada antrean, merah = gagal kirim, abu-abu = belum terhubung.
- Pengiriman idempoten berdasarkan `uid`, jadi kirim ulang tidak membuat baris dobel.
- Arahnya satu: app ke Sheet. Edit langsung di Sheet tidak kembali ke app. Nama kategori dan buku disalin saat mencatat, jadi rename kategori tidak mengubah baris lama di Sheet.

**Keamanan:** URL `/exec` berfungsi sebagai kunci. Siapa pun yang tahu URL-nya bisa menambah atau menghapus baris di tab itu, jadi jangan dibagikan. Kalau bocor, buat deployment baru dan ganti link di app.

Kalau setelah mengubah `Code.gs` kamu ingin URL-nya tetap sama, pilih **Deploy → Manage deployments → Edit → New version**.
