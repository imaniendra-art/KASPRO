import { Calendar, Loader2, Plus, Users, Building, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsBrutalism(props: any) {
  const {
    session,
    periodes, isLoadingPeriodes,
    isCreating, setIsCreating,
    semester, setSemester,
    tahunAjaran, setTahunAjaran,
    paguMaster, setPaguMaster,
    submitting, handleCreate, toggleActive,

    // User management
    users, isLoadingUsers,
    isCreatingUser, setIsCreatingUser,
    editingUserId, setEditingUserId,
    userName, setUserName,
    userUsername, setUserUsername,
    userPassword, setUserPassword,
    userRole, setUserRole,
    userUnitId, setUserUnitId,
    submittingUser, handleCreateUser, deleteUser,
    openEditUser, closeUserForm,

    // Unit management
    units, isLoadingUnits,
    newUnitName, setNewUnitName,
    addingUnit, handleAddUnit, deleteUnit
  } = props;

  const [activeTab, setActiveTab] = useState<'periode' | 'users' | 'units'>('periode');

  if (session?.user?.role !== "admin") {
    return (
      <div className="p-8 max-w-5xl mx-auto pb-20">
        <div className="border-[4px] border-black p-8 bg-[#ff003c] text-white flex flex-col items-center justify-center text-center shadow-[6px_6px_0_0_#000] min-h-[300px]">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">AKSES DITOLAK</h1>
          <p className="text-xl font-bold uppercase tracking-widest border-t-[4px] border-white pt-4">ANDA TIDAK MEMILIKI AKSES KE HALAMAN INI.</p>
          <Link href="/dashboard" className="mt-8 inline-block border-[4px] border-white px-6 py-3 font-black text-2xl uppercase hover:bg-white hover:text-[#ff003c] transition-colors shadow-[6px_6px_0_0_#fff]">
            KEMBALI KE DASHBOARD →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20">
      <div className="mb-12">
        <Link href="/dashboard" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-[#e5ff00] transition-colors mb-6 bg-white text-black shadow-[4px_4px_0_0_#000]">
          ← KEMBALI KE DASHBOARD
        </Link>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">PENGATURAN</h1>
        <p className="text-lg md:text-xl font-bold uppercase tracking-widest mt-4">KONFIGURASI SISTEM KASPRO</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 border-b-[4px] border-black pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('periode')}
          className={`px-6 py-3 border-[4px] border-black font-black text-xl md:text-2xl uppercase whitespace-nowrap transition-transform ${activeTab === 'periode' ? 'bg-[#ff003c] text-white shadow-[6px_6px_0_0_#000] -translate-y-2' : 'bg-white text-black hover:bg-[#e5ff00] hover:shadow-[4px_4px_0_0_#000]'}`}
        >
          <Calendar className="w-6 h-6 inline-block mr-2 -mt-1" />
          PERIODE & PAGU
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 border-[4px] border-black font-black text-xl md:text-2xl uppercase whitespace-nowrap transition-transform ${activeTab === 'users' ? 'bg-[#ff003c] text-white shadow-[6px_6px_0_0_#000] -translate-y-2' : 'bg-white text-black hover:bg-[#e5ff00] hover:shadow-[4px_4px_0_0_#000]'}`}
        >
          <Users className="w-6 h-6 inline-block mr-2 -mt-1" />
          KELOLA USERS
        </button>
        <button
          onClick={() => setActiveTab('units')}
          className={`px-6 py-3 border-[4px] border-black font-black text-xl md:text-2xl uppercase whitespace-nowrap transition-transform ${activeTab === 'units' ? 'bg-[#ff003c] text-white shadow-[6px_6px_0_0_#000] -translate-y-2' : 'bg-white text-black hover:bg-[#e5ff00] hover:shadow-[4px_4px_0_0_#000]'}`}
        >
          <Building className="w-6 h-6 inline-block mr-2 -mt-1" />
          KELOLA UNIT
        </button>
      </div>

      {activeTab === 'periode' && (
        <div className="bg-white border-[4px] border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-[4px] border-black pb-4">
            <h2 className="text-3xl font-black uppercase">PERIODE & PAGU GLOBAL</h2>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="border-[4px] border-black px-6 py-2 bg-black text-[#e5ff00] font-black uppercase hover:bg-[#ff003c] hover:text-white transition-colors"
            >
              {isCreating ? "BATAL X" : "+ PERIODE BARU"}
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="mb-12 bg-[#e5ff00] border-[4px] border-black p-6 md:p-8 shadow-[6px_6px_0_0_#000]">
              <h3 className="text-2xl font-black uppercase mb-6 text-black border-b-[4px] border-black pb-2 inline-block">TAMBAH PERIODE</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Semester</label>
                  <select 
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#e5ff00] transition-colors appearance-none"
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
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#e5ff00] transition-colors"
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
                      className="w-full bg-white border-[4px] border-black py-4 pl-16 pr-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#e5ff00] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8 border-t-[4px] border-black pt-6">
                <button type="submit" disabled={submitting} className="border-[4px] border-black bg-black text-[#e5ff00] px-12 py-4 font-black text-2xl uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 w-full md:w-auto shadow-[4px_4px_0_0_#fff]">
                  {submitting ? "MENYIMPAN..." : "SIMPAN PERIODE"}
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
                <div className="border-[4px] border-black p-8 text-center font-black text-2xl uppercase bg-gray-100">BELUM ADA PERIODE</div>
              ) : (
                periodes?.map((p: any) => (
                  <div key={p._id} className={`border-[4px] border-black p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${p.isActive ? 'bg-black text-[#e5ff00]' : 'bg-white text-black hover:bg-gray-50'}`}>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-3xl font-black uppercase">
                          SEMESTER {p.semester}
                        </h3>
                        {p.isActive && (
                          <span className="bg-[#ff003c] text-white text-sm font-black uppercase px-3 py-1 border-[2px] border-white">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <p className={`text-xl font-bold uppercase ${p.isActive ? 'text-gray-300' : 'text-gray-600'}`}>TAHUN AJARAN {p.tahunAjaran}</p>
                      <p className="text-2xl font-black mt-4">PAGU: RP {p.paguMaster?.toLocaleString('id-ID')}</p>
                    </div>
                    
                    {!p.isActive && (
                      <button 
                        onClick={() => toggleActive(p._id)}
                        className="border-[4px] border-black px-6 py-3 font-black text-xl uppercase bg-[#e5ff00] text-black hover:bg-black hover:text-[#e5ff00] transition-colors shadow-[4px_4px_0_0_#000] w-full md:w-auto"
                      >
                        AKTIFKAN
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border-[4px] border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-[4px] border-black pb-4">
            <h2 className="text-3xl font-black uppercase">MANAJEMEN PENGGUNA</h2>
            <button 
              onClick={() => {
                if(isCreatingUser) {
                  closeUserForm();
                } else {
                  closeUserForm();
                  setIsCreatingUser(true);
                }
              }}
              className="border-[4px] border-black px-6 py-2 bg-black text-[#e5ff00] font-black uppercase hover:bg-[#ff003c] hover:text-white transition-colors"
            >
              {isCreatingUser ? "BATAL X" : "+ PENGGUNA BARU"}
            </button>
          </div>

          {isCreatingUser && (
            <form onSubmit={handleCreateUser} className="mb-12 bg-[#ff003c] border-[4px] border-black p-6 md:p-8 shadow-[6px_6px_0_0_#000] text-white">
              <h3 className="text-2xl font-black uppercase mb-6 border-b-[4px] border-white pb-2 inline-block">
                {editingUserId ? "EDIT PENGGUNA" : "TAMBAH PENGGUNA"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Username</label>
                  <input 
                    type="text" 
                    value={userUsername}
                    onChange={e => setUserUsername(e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2">
                    Password {editingUserId && <span className="text-sm">(Kosongkan jika tak diubah)</span>}
                  </label>
                  <input 
                    type="password" 
                    value={userPassword}
                    onChange={e => setUserPassword(e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors"
                    required={!editingUserId}
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Peran (Role)</label>
                  <select 
                    value={userRole}
                    onChange={e => {
                      setUserRole(e.target.value);
                      if (e.target.value !== "user") setUserUnitId("");
                    }}
                    className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors appearance-none"
                    required
                  >
                    <option value="user">USER / TENDIK</option>
                    <option value="admin">ADMIN / KEUANGAN</option>
                    <option value="ketua">KETUA YAYASAN</option>
                  </select>
                </div>
                
                {userRole === "user" && (
                  <div className="md:col-span-2">
                    <label className="block text-xl font-black uppercase mb-2">Asal Unit / Divisi</label>
                    <select 
                      value={userUnitId}
                      onChange={e => setUserUnitId(e.target.value)}
                      className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors appearance-none"
                      required
                    >
                      <option value="">-- PILIH UNIT --</option>
                      {units?.map((u: any) => (
                        <option key={u._id} value={u._id}>{u.namaUnit}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-8 border-t-[4px] border-white pt-6">
                <button type="submit" disabled={submittingUser} className="border-[4px] border-white bg-black text-[#e5ff00] px-12 py-4 font-black text-2xl uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 w-full md:w-auto shadow-[4px_4px_0_0_#fff]">
                  {submittingUser ? "MENYIMPAN..." : "SIMPAN PENGGUNA"}
                </button>
              </div>
            </form>
          )}

          {isLoadingUsers ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
              <p className="text-2xl font-black uppercase">MEMUAT DATA USERS...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border-[4px] border-black custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-black text-[#e5ff00] border-b-[4px] border-black">
                  <tr>
                    <th className="p-4 font-black uppercase text-xl border-r-[4px] border-white">Nama</th>
                    <th className="p-4 font-black uppercase text-xl border-r-[4px] border-white">Username</th>
                    <th className="p-4 font-black uppercase text-xl border-r-[4px] border-white">Role</th>
                    <th className="p-4 font-black uppercase text-xl border-r-[4px] border-white">Unit</th>
                    <th className="p-4 font-black uppercase text-xl text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[4px] divide-black">
                  {users?.map((u: any) => (
                    <tr key={u._id} className="hover:bg-[#e5ff00] transition-colors group">
                      <td className="p-4 font-bold border-r-[4px] border-black text-lg">{u.namaLengkap}</td>
                      <td className="p-4 font-bold border-r-[4px] border-black">{u.username}</td>
                      <td className="p-4 border-r-[4px] border-black">
                        <span className={`px-3 py-1 text-sm font-black uppercase border-[2px] border-black ${u.role === 'admin' ? 'bg-[#ff003c] text-white' : u.role === 'ketua' ? 'bg-[#e5ff00] text-black' : 'bg-white text-black'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-bold border-r-[4px] border-black text-gray-700">
                        {u.unitId ? u.unitId.namaUnit : "-"}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button onClick={() => {
                          openEditUser(u);
                          setActiveTab('users');
                        }} className="p-2 border-[4px] border-black bg-white hover:bg-black hover:text-[#e5ff00] transition-colors inline-block" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteUser(u._id)} className="p-2 border-[4px] border-black bg-white hover:bg-[#ff003c] hover:text-white transition-colors inline-block" title="Hapus">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center font-black text-2xl uppercase bg-gray-100">BELUM ADA USER</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'units' && (
        <div className="bg-white border-[4px] border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-[4px] border-black pb-4">
            <h2 className="text-3xl font-black uppercase">MANAJEMEN UNIT</h2>
          </div>

          <form onSubmit={handleAddUnit} className="mb-12 bg-black border-[4px] border-black p-6 md:p-8 shadow-[6px_6px_0_0_#ff003c] flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xl font-black uppercase mb-2 text-[#e5ff00]">Nama Unit / Divisi Baru</label>
              <input 
                type="text" 
                value={newUnitName}
                onChange={e => setNewUnitName(e.target.value)}
                placeholder="CONTOH: DEPARTEMEN IT" 
                className="w-full bg-white border-[4px] border-white py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors"
                required
              />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={addingUnit} className="border-[4px] border-[#e5ff00] bg-[#e5ff00] text-black h-[64px] px-8 font-black text-2xl uppercase hover:bg-white hover:border-white transition-colors disabled:opacity-50 w-full md:w-auto">
                {addingUnit ? "MENAMBAHKAN..." : "+ TAMBAH"}
              </button>
            </div>
          </form>

          {isLoadingUnits ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
              <p className="text-2xl font-black uppercase">MEMUAT DATA UNIT...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {units?.map((u: any) => (
                <div key={u._id} className="border-[4px] border-black bg-white p-6 flex justify-between items-center group hover:bg-[#e5ff00] transition-colors shadow-[4px_4px_0_0_#000]">
                  <h3 className="font-black text-xl uppercase tracking-tighter truncate" title={u.namaUnit}>
                    {u.namaUnit}
                  </h3>
                  <button 
                    onClick={() => handleDeleteUnit(u._id)}
                    className="p-3 border-[4px] border-black bg-white hover:bg-[#ff003c] hover:text-white transition-colors"
                    title="Hapus Unit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {units?.length === 0 && (
                <div className="col-span-full border-[4px] border-black p-8 text-center font-black text-2xl uppercase bg-gray-100">
                  BELUM ADA UNIT
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
