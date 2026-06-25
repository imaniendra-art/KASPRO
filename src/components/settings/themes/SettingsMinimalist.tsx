import { Calendar, Loader2, Plus } from "lucide-react";

export default function SettingsMinimalist(props: any) {
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
    <div className="space-y-6 ">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Sistem</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola preferensi dan sistem anggaran.</p>
      </div>

      {session?.user?.role === "admin_keuangan" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Periode & Pagu Global</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Atur periode anggaran dan total Pagu Master kampus.</p>
            </div>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Periode Baru
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="mb-6 bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                  <select 
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tahun Ajaran</label>
                  <input 
                    type="text" 
                    value={tahunAjaran}
                    onChange={e => setTahunAjaran(e.target.value)}
                    placeholder="Contoh: 2026/2027" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pagu Master (Rp)</label>
                  <input 
                    type="number" 
                    value={paguMaster}
                    onChange={e => setPaguMaster(e.target.value)}
                    placeholder="Contoh: 150000000" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsCreating(false)} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">Batal</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? "Menyimpan..." : "Simpan Periode"}
                </button>
              </div>
            </form>
          )}

          {isLoadingPeriodes ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : (
            <div className="space-y-3">
              {periodes?.length === 0 ? (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 border-dashed rounded-lg">Belum ada periode yang dibuat.</div>
              ) : (
                periodes?.map((p: any) => (
                  <div key={p._id} className={`flex items-center justify-between p-4 rounded-lg border ${p.isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-md ${p.isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          Semester {p.semester} - {p.tahunAjaran} 
                          {p.isActive && <span className="text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Aktif</span>}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Pagu Master: <span className="font-medium text-gray-900 dark:text-gray-100">Rp {p.paguMaster.toLocaleString('id-ID')}</span> &bull; Sisa: <span className="font-medium text-gray-900 dark:text-gray-100">Rp {p.sisaPagu.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleActive(p._id, p.isActive)}
                      disabled={p.isActive}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${p.isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 cursor-default' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
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
