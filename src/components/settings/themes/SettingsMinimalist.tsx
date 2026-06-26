import { Calendar, Loader2, Plus, Users, Building2, X, Eye, EyeOff, Wallet, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    case "ketua": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "user": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    default: return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
};

export default function SettingsMinimalist(props: any) {
  const {
    session,
    activeTab, setActiveTab,
    // Periode props
    periodes, isLoadingPeriodes,
    isCreating, setIsCreating,
    editingPeriodeId, setEditingPeriodeId,
    semester, setSemester,
    tahunAjaran, setTahunAjaran,
    paguMaster, setPaguMaster,
    submitting, handleCreate, toggleActive, openEditPeriode,
    // User props
    users, isLoadingUsers,
    units, isLoadingUnits,
    isCreatingUser, setIsCreatingUser,
    editingUserId,
    userName, setUserName,
    userUsername, setUserUsername,
    userPassword, setUserPassword,
    userRole, setUserRole,
    userUnitId, setUserUnitId,
    submittingUser,
    handleCreateUser, openEditUser, closeUserForm, deleteUser,
    // Unit props
    newUnitName, setNewUnitName,
    addingUnit, handleAddUnit, deleteUnit,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: "periode", label: "Periode & Pagu", icon: Wallet },
    { id: "users", label: "Kelola User", icon: Users },
  ];

  if (session?.user?.role !== "admin") {
    return <div className="p-8 text-center text-gray-500">Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Sistem</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola preferensi dan sistem anggaran.</p>
        </div>
        
        {/* Tabs inside Header */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-md border border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "periode" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Periode & Pagu Global</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Atur periode anggaran dan total Pagu Master kampus.</p>
            </div>
            <button 
              onClick={() => { setEditingPeriodeId(null); setIsCreating(!isCreating); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Periode Baru
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="mb-6 bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <button type="button" onClick={() => { setIsCreating(false); setEditingPeriodeId(null); }} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">Batal</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? "Menyimpan..." : editingPeriodeId ? "Simpan Perubahan" : "Simpan Periode"}
                </button>
              </div>
            </form>
          )}

          {isLoadingPeriodes ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : (
            <div className="space-y-3">
              {(!periodes || periodes.length === 0) ? (
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
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditPeriode(p)}
                        className="p-2 rounded-md text-sm font-medium transition-all bg-gray-50 dark:bg-gray-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-700"
                        title="Edit Periode"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleActive(p._id, p.isActive)}
                        disabled={p.isActive}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${p.isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 cursor-default' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-700'}`}
                      >
                        {p.isActive ? 'Periode Aktif' : 'Jadikan Aktif'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" /> Kelola Unit
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Siapkan unit organisasi sebelum membuat akun user.</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newUnitName}
                onChange={e => setNewUnitName(e.target.value)}
                placeholder="Nama unit baru..."
                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyDown={e => e.key === "Enter" && handleAddUnit()}
              />
              <button
                onClick={handleAddUnit}
                disabled={addingUnit || !newUnitName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>

            {isLoadingUnits ? (
              <div className="flex items-center justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
            ) : (!units || units.length === 0) ? (
              <div className="text-center p-4 text-gray-500 text-sm border border-dashed border-gray-200 dark:border-gray-700 rounded-md">Belum ada unit.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {units?.map((unit: any) => (
                  <div key={unit._id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm group">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{unit.namaUnit}</span>
                    <button
                      onClick={() => deleteUnit(unit._id)}
                      className="p-0.5 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Hapus unit"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> Daftar User
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kelola akun pengguna sistem.</p>
              </div>
              <button 
                onClick={() => { closeUserForm(); setIsCreatingUser(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Tambah User
              </button>
            </div>

            {isCreatingUser && (
              <form onSubmit={handleCreateUser} className="mb-6 bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{editingUserId ? "Edit User" : "Buat User Baru"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" value={userName} onChange={e => setUserName(e.target.value)} required
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input 
                      type="text" value={userUsername} onChange={e => setUserUsername(e.target.value)} required
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password {editingUserId && <span className="text-gray-400 text-xs">(kosongkan jika tidak diubah)</span>}
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={userPassword} 
                        onChange={e => setUserPassword(e.target.value)} 
                        required={!editingUserId}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select 
                      value={userRole} onChange={e => setUserRole(e.target.value)} required
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                      <option value="user">User</option>
                      <option value="ketua">Ketua</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {userRole === "user" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                      <select 
                        value={userUnitId} onChange={e => setUserUnitId(e.target.value)} required
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      >
                        <option value="">Pilih unit...</option>
                        {units?.map((u: any) => (
                          <option key={u._id} value={u._id}>{u.namaUnit}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeUserForm} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">Batal</button>
                  <button type="submit" disabled={submittingUser} className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                    {submittingUser ? "Menyimpan..." : editingUserId ? "Simpan Perubahan" : "Buat User"}
                  </button>
                </div>
              </form>
            )}

            {isLoadingUsers ? (
              <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : (!users || users.length === 0) ? (
              <div className="text-center p-8 text-gray-500 border border-gray-200 dark:border-gray-700 border-dashed rounded-md">Belum ada user.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users?.map((u: any) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                        <td className="p-3">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{u.namaLengkap}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-500 dark:text-gray-400 font-mono">{u.username}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-xs rounded border font-medium capitalize ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                          {u.unitId?.namaUnit || <span className="text-gray-300 dark:text-gray-600">—</span>}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditUser(u)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteUser(u._id)}
                              className="p-2 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Hapus user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
