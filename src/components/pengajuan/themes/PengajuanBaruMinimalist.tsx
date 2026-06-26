import Link from "next/link";

export default function PengajuanBaruMinimalist(props: any) {
  const {
    judul, setJudul, deskripsi, setDeskripsi, prokerId, setProkerId, prokers,
    rab, handleRabChange, addRabItem, removeRabItem, totalNominal,
    handleSubmit, isSubmitting, error, success
  } = props;

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pengajuan Berhasil!</h2>
        <p className="text-gray-500 dark:text-gray-400">Pengajuan Anda telah berhasil dikirim dan sedang menunggu persetujuan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center gap-4">
        <Link href="/pengajuan" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">← Kembali</Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buat Pengajuan Baru</h1>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Informasi Umum</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Pengajuan</label>
            <input type="text" required value={judul} onChange={e => setJudul(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
            <textarea required rows={3} value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Kerja</label>
            <select value={prokerId} onChange={e => setProkerId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">-- Non Program Kerja --</option>
              {prokers?.map((p: any) => (
                <option key={p._id} value={p._id}>{p.judul} - Sisa Pagu: Rp {p.sisaAnggaran?.toLocaleString('id-ID')}</option>
              ))}
            </select>
            {prokerId && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Pengajuan ini akan memotong Sisa Pagu dari program kerja yang dipilih.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rincian Anggaran (RAB)</h3>
            <button type="button" onClick={addRabItem} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">+ Tambah Item</button>
          </div>

          <div className="space-y-4">
            {rab.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nama Item</label>
                  <input type="text" required value={item.namaItem} onChange={e => handleRabChange(i, "namaItem", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm" />
                </div>
                <div className="w-20">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah</label>
                  <input type="number" required min="1" value={item.jumlah} onChange={e => handleRabChange(i, "jumlah", Number(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Harga Satuan</label>
                  <input type="number" required min="0" value={item.hargaSatuan || ''} onChange={e => handleRabChange(i, "hargaSatuan", Number(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm" />
                </div>
                <div className="w-10">
                  <button type="button" onClick={() => removeRabItem(i)} disabled={rab.length === 1} className="w-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md disabled:opacity-50">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <div className="text-right">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Pengajuan</span>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rp {totalNominal.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting || totalNominal === 0} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
            {isSubmitting ? "Memproses..." : "Kirim Pengajuan"}
          </button>
        </div>
      </form>
    </div>
  );
}
