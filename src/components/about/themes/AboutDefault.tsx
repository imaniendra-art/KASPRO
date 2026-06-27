import { Info, BookOpen, User, Sparkles } from "lucide-react";

export default function AboutDefault({ session }: { session: any }) {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Info className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bantuan & Tentang KASPRO</h1>
          <p className="text-slate-500 dark:text-gray-400">Panduan penggunaan dan informasi sistem KASPRO STIMI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Manual Section */}
        <div className="bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Panduan Pengguna</h2>
          </div>
          
          <div className="space-y-6 text-slate-600 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">1. Membuat Pengajuan Dana</h3>
              <p className="text-sm leading-relaxed">
                Navigasi ke menu <strong>Pengajuan Dana</strong>. Klik tombol <strong>+ Pengajuan Baru</strong>. Isi form nominal, judul, dan kaitkan dengan Program Kerja jika ada. Tunggu validasi dari Ketua dan Admin.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">2. Upload Bukti Transaksi (LPJ)</h3>
              <p className="text-sm leading-relaxed">
                Setelah pengajuan Anda dicairkan, Anda wajib mengunggah bukti transaksi (struk/nota). Buka detail pengajuan, lalu klik <strong>Upload Bukti</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">3. Program Kerja</h3>
              <p className="text-sm leading-relaxed">
                Gunakan menu <strong>Program Kerja</strong> untuk merencanakan kegiatan selama satu periode. Proker yang disetujui akan mengalokasikan anggaran divisi Anda.
              </p>
            </div>
          </div>
        </div>

        {/* About System Section */}
        <div className="space-y-8">
          <div className="bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tentang KASPRO</h2>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-300 mb-6">
              KASPRO (Kas & Program Kerja) adalah sistem informasi manajemen keuangan dan kegiatan untuk organisasi di STIMI. Sistem ini dirancang untuk transparansi, efisiensi, dan kemudahan dalam melacak arus kas serta realisasi program kerja.
            </p>

            <div className="bg-blue-50/50 dark:bg-blue-500/5 rounded-xl p-4 border border-blue-100 dark:border-blue-500/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex flex-shrink-0 items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Tim Pengembang</h4>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Sistem ini dikembangkan secara eksklusif oleh <strong>Iman Prasetyo</strong> untuk STIMI.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Butuh Bantuan Lebih Lanjut?</h2>
            <p className="text-indigo-100 mb-6 text-sm">
              Jika Anda menemukan bug, error, atau memiliki pertanyaan seputar penggunaan aplikasi, silakan hubungi tim IT Administrator STIMI.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-medium text-sm border border-white/20">
              Versi Sistem: 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
