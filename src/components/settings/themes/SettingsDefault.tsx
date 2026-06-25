import { ArrowLeft, Calendar, Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function SettingsDefault(props: any) {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto text-slate-900 dark:text-white pb-20">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">Kelola preferensi dan sistem anggaran.</p>
      </div>

      {session?.user?.role === "keuangan" && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Periode & Pagu Global</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">Atur periode anggaran dan total Pagu Master kampus.</p>
            </div>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors border border-slate-200 dark:border-white/10"
            >
              <Plus className="w-4 h-4" />
              Periode Baru
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="mb-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Semester</label>
                  <select 
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    required
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tahun Ajaran</label>
                  <input 
                    type="text" 
                    value={tahunAjaran}
                    onChange={e => setTahunAjaran(e.target.value)}
                    placeholder="Contoh: 2026/2027" 
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Pagu Master (Rp)</label>
                  <input 
                    type="number" 
                    value={paguMaster}
                    onChange={e => setPaguMaster(e.target.value)}
                    placeholder="Contoh: 150000000" 
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsCreating(false)} className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">Batal</button>
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? "Menyimpan..." : "Simpan Periode"}
                </button>
              </div>
            </form>
          )}

          {isLoadingPeriodes ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400 dark:text-gray-400" /></div>
          ) : (
            <div className="space-y-3">
              {periodes?.length === 0 ? (
                <div className="text-center p-8 text-slate-500 dark:text-gray-500 border border-slate-200 dark:border-white/5 border-dashed rounded-xl">Belum ada periode yang dibuat.</div>
              ) : (
                periodes?.map((p: any) => (
                  <div key={p._id} className={`flex items-center justify-between p-4 rounded-xl border ${p.isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${p.isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          Semester {p.semester} - {p.tahunAjaran} 
                          {p.isActive && <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Aktif</span>}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                          Pagu Master: <span className="text-slate-900 dark:text-white font-medium">Rp {p.paguMaster.toLocaleString('id-ID')}</span> &bull; Sisa: <span className="text-slate-900 dark:text-white font-medium">Rp {p.sisaPagu.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleActive(p._id, p.isActive)}
                      disabled={p.isActive}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${p.isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 cursor-default' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'}`}
                    >
                      {p.isActive ? 'Periode Aktif' : 'Jadikan Aktif'}
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
