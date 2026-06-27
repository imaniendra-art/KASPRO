import { Info, BookOpen, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutMinimalist({ session }: { session: any }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Pusat Bantuan & Informasi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Pelajari cara menggunakan KASPRO
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 md:p-8 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Panduan Pengguna</h2>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Membuat Pengajuan</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Akses menu Pengajuan Dana, lalu isi formulir dengan judul dan nominal yang dibutuhkan. Admin akan memvalidasi pengajuan Anda.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Upload Bukti Transaksi</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Setiap dana yang telah cair harus dipertanggungjawabkan. Klik pengajuan Anda yang telah berstatus "Dicairkan" dan unggah foto struk belanja Anda.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Manajemen Program Kerja</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Daftarkan rencana kegiatan Anda di menu Proker agar sistem mencadangkan anggaran secara otomatis sebelum dieksekusi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center gap-3">
          <Info className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tentang KASPRO</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            KASPRO adalah perangkat lunak manajemen keuangan dan program kerja yang dikembangkan untuk menyederhanakan pelacakan arus kas, mempercepat proses persetujuan, dan meningkatkan transparansi pengeluaran di STIMI.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Developed by</p>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">Iman Prasetyo</p>
            </div>
            <div className="ml-auto text-sm text-gray-400 font-medium px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              v1.0.0
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
