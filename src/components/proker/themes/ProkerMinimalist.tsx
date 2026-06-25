import { Plus } from "lucide-react";

export default function ProkerMinimalist({
  data, isLoading, error, isAdding, setIsAdding, newProker, setNewProker, handleAddProker, isSubmitting
}: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Program Kerja</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola master pagu program kerja.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Tambah Proker
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProker} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Proker</label>
            <input type="text" required value={newProker.judul} onChange={e => setNewProker({...newProker, judul: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pagu Anggaran</label>
            <input type="number" required value={newProker.paguAnggaran || ''} onChange={e => setNewProker({...newProker, paguAnggaran: Number(e.target.value)})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
          </div>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50">
            Simpan
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((proker: any) => (
          <div key={proker._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{proker.judul}</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Pagu Awal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">Rp {proker.paguAnggaran.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Terpakai</span>
                <span className="font-medium text-red-600 dark:text-red-400">Rp {(proker.paguAnggaran - proker.sisaAnggaran).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Sisa Anggaran</span>
                <span className="font-bold text-green-600 dark:text-green-400">Rp {proker.sisaAnggaran.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, ((proker.paguAnggaran - proker.sisaAnggaran) / proker.paguAnggaran) * 100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
