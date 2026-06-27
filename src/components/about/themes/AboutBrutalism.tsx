import Link from "next/link";
import { Info, BookOpen, Sparkles } from "lucide-react";

export default function AboutBrutalism({ session }: { session: any }) {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20">
      <div className="mb-12 border-b-[4px] border-black pb-8">
        <Link href="/dashboard" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-[#e5ff00] transition-colors mb-6 bg-white text-black shadow-[4px_4px_0_0_#000]">
          ← KEMBALI
        </Link>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
          <Info className="w-12 h-12 md:w-20 md:h-20 text-[#ff003c]" />
          BANTUAN
        </h1>
        <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mt-4">MANUAL & TENTANG KASPRO</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* User Manual */}
        <div className="bg-white border-[4px] border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-[4px] border-black">
            <div className="bg-black text-white p-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black uppercase">PANDUAN PENGGUNA</h2>
          </div>

          <div className="space-y-8">
            <div className="border-[4px] border-black p-4 bg-[#e5ff00] shadow-[4px_4px_0_0_#000]">
              <h3 className="text-xl font-black uppercase mb-2">1. PENGAJUAN DANA</h3>
              <p className="font-bold text-lg leading-tight">
                Gunakan menu Pengajuan Dana untuk meminta pencairan. Wajib mengisi judul dan nominal. Tunggu divalidasi oleh Admin.
              </p>
            </div>
            
            <div className="border-[4px] border-black p-4 bg-white shadow-[4px_4px_0_0_#000]">
              <h3 className="text-xl font-black uppercase mb-2">2. UPLOAD BUKTI (LPJ)</h3>
              <p className="font-bold text-lg leading-tight">
                Dana yang sudah dicairkan wajib dilampirkan bukti bon/struk. Masuk ke detail pengajuan Anda dan klik "Upload Bukti".
              </p>
            </div>

            <div className="border-[4px] border-black p-4 bg-[#ff003c] text-white shadow-[4px_4px_0_0_#000]">
              <h3 className="text-xl font-black uppercase mb-2">3. PROGRAM KERJA</h3>
              <p className="font-bold text-lg leading-tight">
                Rencanakan kegiatan divisi Anda di awal periode melalui menu Proker agar anggaran di-lock oleh sistem.
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="space-y-8 md:space-y-12">
          <div className="bg-black text-white border-[4px] border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#e5ff00]">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-[4px] border-white">
              <Sparkles className="w-8 h-8 text-[#e5ff00]" />
              <h2 className="text-3xl font-black uppercase">TENTANG SISTEM</h2>
            </div>
            <p className="font-bold text-xl leading-tight mb-8">
              KASPRO (KAS & PROGRAM KERJA) ADALAH SISTEM MANAJEMEN KEUANGAN ORGANISASI STIMI. DIRANCANG UNTUK TRANSPARANSI DAN EFISIENSI ARUS KAS.
            </p>
            
            <div className="bg-white text-black border-[4px] border-white p-4">
              <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-gray-500">DEVELOPER / CREATOR</h4>
              <p className="text-2xl font-black uppercase">IMAN PRASETYO</p>
            </div>
          </div>

          <div className="border-[4px] border-black p-6 md:p-8 text-center bg-gray-100">
            <h2 className="text-4xl font-black uppercase mb-2">BUTUH BANTUAN?</h2>
            <p className="font-bold text-xl uppercase mb-6">
              LAPORKAN BUG / ERROR KE TIM IT STIMI
            </p>
            <div className="inline-block border-[4px] border-black bg-white px-6 py-2 font-black text-xl uppercase shadow-[4px_4px_0_0_#000]">
              VERSI 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
