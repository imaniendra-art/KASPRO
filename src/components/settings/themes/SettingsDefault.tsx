import { Calendar, Loader2, Pencil, Plus, Trash2, Users, Wallet, Building2, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin": return "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30";
    case "ketua": return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
    case "user": return "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10";
    default: return "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10";
  }
};

export default function SettingsDefault(props: any) {
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto text-slate-900 dark:text-white pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">Kelola periode anggaran, user, dan unit organisasi.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Periode & Pagu */}
      {activeTab === "periode" && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Periode & Pagu Global</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">Atur periode anggaran dan total Pagu Master kampus.</p>
            </div>
            <button 
              onClick={() => { setEditingPeriodeId(null); setIsCreating(!isCreating); }}
              className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors border border-slate-200 dark:border-white/10"
            >
              <Plus className="w-4 h-4" />
              Periode Baru
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="mb-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <button type="button" onClick={() => { setIsCreating(false); setEditingPeriodeId(null); }} className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">Batal</button>
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? "Menyimpan..." : editingPeriodeId ? "Simpan Perubahan" : "Simpan Periode"}
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
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditPeriode(p)}
                        className="p-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-white/5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10"
                        title="Edit Periode"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleActive(p._id, p.isActive)}
                        disabled={p.isActive}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${p.isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 cursor-default' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'}`}
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

      {/* Tab Content: User Management */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Unit Management */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" /> Kelola Unit
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Siapkan unit organisasi sebelum membuat akun user.</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newUnitName}
                onChange={e => setNewUnitName(e.target.value)}
                placeholder="Nama unit baru..."
                className="flex-1 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyDown={e => e.key === "Enter" && handleAddUnit()}
              />
              <button
                onClick={handleAddUnit}
                disabled={addingUnit || !newUnitName.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>

            {isLoadingUnits ? (
              <div className="flex items-center justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
            ) : units?.length === 0 ? (
              <div className="text-center p-4 text-slate-400 dark:text-gray-500 text-sm border border-dashed border-slate-200 dark:border-white/10 rounded-xl">Belum ada unit.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {units?.map((unit: any) => (
                  <div key={unit._id} className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm group">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-700 dark:text-gray-300">{unit.namaUnit}</span>
                    <button
                      onClick={() => deleteUnit(unit._id)}
                      className="p-0.5 text-slate-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Hapus unit"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User List */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> Daftar User
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Kelola akun pengguna sistem.</p>
              </div>
              <button 
                onClick={() => { closeUserForm(); setIsCreatingUser(true); }}
                className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors border border-slate-200 dark:border-white/10"
              >
                <Plus className="w-4 h-4" />
                Tambah User
              </button>
            </div>

            {/* Create / Edit User Form */}
            {isCreatingUser && (
              <form onSubmit={handleCreateUser} className="mb-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-xl space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{editingUserId ? "Edit User" : "Buat User Baru"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input 
                      type="text" value={userName} onChange={e => setUserName(e.target.value)} required
                      placeholder="Nama lengkap"
                      className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Username</label>
                    <input 
                      type="text" value={userUsername} onChange={e => setUserUsername(e.target.value)} required
                      placeholder="Username untuk login"
                      className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Password {editingUserId && <span className="normal-case text-slate-400">(kosongkan jika tidak diubah)</span>}
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={userPassword} 
                        onChange={e => setUserPassword(e.target.value)} 
                        required={!editingUserId}
                        placeholder={editingUserId ? "Kosongkan jika tidak diubah" : "Password"}
                        className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Role</label>
                    <select 
                      value={userRole} onChange={e => setUserRole(e.target.value)} required
                      className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm"
                    >
                      <option value="user">User</option>
                      <option value="ketua">Ketua</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {userRole === "user" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Unit</label>
                      <select 
                        value={userUnitId} onChange={e => setUserUnitId(e.target.value)} required
                        className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm"
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
                  <button type="button" onClick={closeUserForm} className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">Batal</button>
                  <button type="submit" disabled={submittingUser} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50">
                    {submittingUser ? "Menyimpan..." : editingUserId ? "Simpan Perubahan" : "Buat User"}
                  </button>
                </div>
              </form>
            )}

            {/* User Table */}
            {isLoadingUsers ? (
              <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400 dark:text-gray-400" /></div>
            ) : users?.length === 0 ? (
              <div className="text-center p-8 text-slate-500 dark:text-gray-500 border border-slate-200 dark:border-white/5 border-dashed rounded-xl">Belum ada user.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10">
                      <th className="p-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {users?.map((u: any) => (
                      <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="p-3">
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{u.namaLengkap}</span>
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-gray-400 font-mono">{u.username}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 text-xs rounded-full border font-medium capitalize ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-gray-400">
                          {u.unitId?.namaUnit || <span className="text-slate-300 dark:text-gray-600">—</span>}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditUser(u)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Hapus"
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
