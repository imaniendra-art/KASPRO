# KASPRO (Sistem Manajemen Pengajuan Kas & Program Kerja)

KASPRO adalah aplikasi berbasis web yang dirancang untuk memudahkan proses pengajuan dana untuk Program Kerja (Proker) maupun pengajuan dana operasional lainnya. Aplikasi ini terintegrasi dengan Finara dan dibangun menggunakan Next.js, MongoDB, dan Tailwind CSS.

## 🚀 Fitur Utama

- **Manajemen Program Kerja (Proker):** Pengelolaan pagu anggaran dan detail program kerja.
- **Pengajuan Dana (RAB):** Pembuatan Rencana Anggaran Biaya (RAB) yang terperinci.
- **Alur Persetujuan Bertingkat:** Proses *review* mulai dari Admin, persetujuan Ketua, hingga pencairan oleh bagian Keuangan.
- **Laporan Pertanggungjawaban (LPJ):** Fasilitas unggah bukti pengeluaran untuk setiap pengajuan yang telah dicairkan.
- **Integrasi Finara:** Sinkronisasi data keuangan/pencairan.
- **Kustomisasi Tema Tampilan:** Pilihan antarmuka pengguna (Minimalist, Brutalism, dan Default).

---

## 📖 Tutorial Penggunaan KASPRO (User Guide)

Berikut adalah alur standar penggunaan sistem KASPRO untuk pengguna:

### 1. Membuat Pengajuan Baru
- Login ke dalam sistem menggunakan akun yang telah terdaftar.
- Navigasi ke menu **Pengajuan** (atau melalui menu **Program Kerja** jika pengajuan terikat pada proker tertentu).
- Klik tombol **Buat Pengajuan**.
- Isi formulir pengajuan dengan detail berikut:
  - **Judul & Deskripsi:** Penjelasan singkat dan jelas mengenai tujuan penggunaan dana.
  - **Program Kerja (Opsional):** Pilih proker yang menaungi pengajuan ini.
  - **RAB (Rencana Anggaran Biaya):** Tambahkan item per item yang dibutuhkan, termasuk **Nama Item**, **Jumlah**, **Satuan**, dan **Harga Satuan**. Sistem akan menghitung total secara otomatis.
- Klik simpan/kirim. Pengajuan Anda akan masuk dengan status awal `Review Admin`.

### 2. Memantau Alur Persetujuan (Approval Workflow)
Pengajuan Anda akan diproses melalui beberapa tahapan. Anda bisa memantaunya di dashboard:
1. **Review Admin:** Admin memeriksa kelengkapan administratif pengajuan.
2. **Menunggu Ketua:** Setelah lolos verifikasi Admin, Ketua akan meninjau untuk memberikan persetujuan final (ACC).
3. **Diproses Keuangan:** Pengajuan yang disetujui akan masuk ke bagian Keuangan untuk persiapan dana.
4. **Dicairkan:** Dana telah ditransfer atau diserahkan kepada pihak pengusul.

### 3. Pelaporan & LPJ (Laporan Pertanggungjawaban)
Setelah kegiatan selesai dilaksanakan dan dana digunakan:
- Buka halaman detail pengajuan Anda yang berstatus `Dicairkan`.
- Unggah file bukti kuitansi atau nota pengeluaran pada bagian unggah **Bukti LPJ**.
- Status pengajuan akan berubah menjadi `LPJ Diperiksa`.
- Setelah bagian keuangan/admin memvalidasi bukti tersebut, pengajuan akan ditutup dengan status `Selesai`.

---

## 🛠️ Panduan Instalasi & Pengembangan (Developer)

Jika Anda adalah pengembang yang ingin menjalankan proyek ini secara lokal:

### Prasyarat
- Node.js (Minimal versi 18.x)
- MongoDB Database (Lokal atau Atlas)

### Langkah-langkah Menjalankan Proyek
1. Clone repositori ini ke komputer lokal:
   ```bash
   git clone https://github.com/stimi-yapmim/kaspro.git
   cd kaspro
   ```
2. Instal semua dependensi yang dibutuhkan:
   ```bash
   npm install
   ```
3. Konfigurasi Environment Variables. Buat file `.env` di direktori utama proyek dan sesuaikan dengan environment Anda:
   ```env
   MONGODB_URI=mongodb://localhost:27017/kaspro_db
   NEXTAUTH_SECRET=buat_secret_key_anda_disini
   NEXTAUTH_URL=http://localhost:3010
   ```
4. Jalankan mode pengembangan (*development*):
   ```bash
   npm run dev
   ```
5. Akses aplikasi melalui browser di URL: `http://localhost:3010`

---
*Dokumentasi ini akan terus diperbarui seiring dengan perkembangan fitur aplikasi KASPRO.*
