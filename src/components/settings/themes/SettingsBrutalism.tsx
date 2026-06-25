import { Calendar, Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function SettingsBrutalism(props: any) {
  const {
    session,
    periodes, isLoadingPeriodes,
    isCreating, setIsCreating,
    semester, setSemester,
    tahunAjaran, setTahunAjaran,
    paguMaster, setPaguMaster,
    submitting, handleCreate, toggleActive
  } = props;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="mb-12">
        <Link href="/dashboard" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-white transition-colors mb-6 bg-white text-black">
          ← KEMBALI KE DASHBOARD
        </Link>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Sistem</h1>
        <p className="text-xl font-bold uppercase tracking-widest mt-4">PENGATURAN & PERIODE</p>
      </div>

      {session?.user?.role === "keuangan" && (
        <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-[4px] border-black pb-4">
            <h2 className="text-3xl font-black uppercase">PERIODE & PAGU GLOBAL</h2>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="border-[4px] border-black px-6 py-2 bg-black text-[#ffffff] font-black uppercase hover:bg-[#e5ff00] hover:text-black transition-colors"
            >
              + {isCreating ? "BATAL" : "PERIODE BARU"}
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="mb-12 bg-[#e5ff00] border-[4px] border-black p-8">
              <h3 className="text-2xl font-black uppercase mb-6 text-black">TAMBAH PERIODE</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Semester</label>
                  <select 
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors appearance-none rounded-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='4' stroke-linecap='square' stroke-linejoin='miter'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em'
                    }}
                    required
                  >
                    <option value="Ganjil">GANJIL</option>
                    <option value="Genap">GENAP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Tahun Ajaran</label>
                  <input 
                    type="text" 
                    value={tahunAjaran}
                    onChange={e => setTahunAjaran(e.target.value)}
                    placeholder="CONTOH: 2026/2027" 
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Pagu Master (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-4 text-black font-black text-xl">RP</span>
                    <input 
                      type="number" 
                      value={paguMaster}
                      onChange={e => setPaguMaster(e.target.value)}
                      placeholder="150000000" 
                      className="w-full bg-white border-[4px] border-black py-4 pl-16 pr-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="submit" disabled={submitting} className="border-[4px] border-black bg-black text-[#ffffff] px-12 py-4 font-black text-2xl uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto">
                  {submitting ? "MENYIMPAN..." : "SIMPAN"}
                </button>
              </div>
            </form>
          )}

          {isLoadingPeriodes ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
              <p className="text-2xl font-black uppercase">MEMUAT DATA...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {periodes?.length === 0 ? (
                <div className="p-12 text-center text-3xl font-black uppercase border-[4px] border-black border-dashed">
                  BELUM ADA PERIODE.
                </div>
              ) : (
                periodes?.map((p: any) => (
                  <div key={p._id} className={`border-[4px] border-black p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${p.isActive ? 'bg-[#e5ff00]' : 'bg-white hover:bg-slate-100'}`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                      <div className={`p-4 border-[4px] border-black ${p.isActive ? 'bg-black text-[#ffffff]' : 'bg-white text-black'}`}>
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-black uppercase flex items-center gap-4 flex-wrap">
                          SEMESTER {p.semester} - {p.tahunAjaran} 
                          {p.isActive && <span className="bg-black text-[#ffffff] px-4 py-1 text-sm border-[4px] border-black">AKTIF</span>}
                        </div>
                        <div className="text-lg font-bold uppercase mt-2">
                          PAGU: RP {p.paguMaster.toLocaleString('id-ID')} &bull; SISA: RP {p.sisaPagu.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleActive(p._id, p.isActive)}
                      disabled={p.isActive}
                      className={`px-6 py-3 border-[4px] border-black text-lg font-black uppercase transition-colors whitespace-nowrap w-full md:w-auto ${p.isActive ? 'bg-white text-black cursor-default opacity-50' : 'bg-black text-[#ffffff] hover:bg-[#ff003c] hover:text-[#ffffff]'}`}
                    >
                      {p.isActive ? 'PERIODE AKTIF' : 'JADIKAN AKTIF'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
