"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SettingsDefault from "@/components/settings/themes/SettingsDefault";
import SettingsBrutalism from "@/components/settings/themes/SettingsBrutalism";
import SettingsMinimalist from "@/components/settings/themes/SettingsMinimalist";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  // Tab state
  const [activeTab, setActiveTab] = useState("periode");

  // Periode state
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPeriodeId, setEditingPeriodeId] = useState<string | null>(null);
  const [semester, setSemester] = useState("Ganjil");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [paguMaster, setPaguMaster] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // User management state
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userUnitId, setUserUnitId] = useState("");
  const [submittingUser, setSubmittingUser] = useState(false);

  // Unit management state
  const [newUnitName, setNewUnitName] = useState("");
  const [addingUnit, setAddingUnit] = useState(false);

  const { data: periodes, isLoading: isLoadingPeriodes } = useQuery({
    queryKey: ["periode"],
    queryFn: async () => {
      const res = await fetch("/api/periode");
      if (!res.ok) throw new Error("Gagal mengambil periode");
      return (await res.json()).data;
    }
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Gagal mengambil users");
      return (await res.json()).data;
    }
  });

  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const res = await fetch("/api/units");
      if (!res.ok) throw new Error("Gagal mengambil units");
      return (await res.json()).data;
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ---- Periode Handlers ----
  const handleCreatePeriode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingPeriodeId ? `/api/periode/${editingPeriodeId}` : "/api/periode";
      const method = editingPeriodeId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          semester,
          tahunAjaran,
          paguMaster: Number(paguMaster),
          ...(editingPeriodeId ? {} : { isActive: false })
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setIsCreating(false);
      setEditingPeriodeId(null);
      setSemester("Ganjil");
      setTahunAjaran("");
      setPaguMaster("");
      queryClient.invalidateQueries({ queryKey: ["periode"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditPeriode = (p: any) => {
    setEditingPeriodeId(p._id);
    setSemester(p.semester);
    setTahunAjaran(p.tahunAjaran);
    setPaguMaster(String(p.paguMaster));
    setIsCreating(true);
  };

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    if (currentlyActive) return;
    try {
      const res = await fetch(`/api/periode/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true })
      });
      if (!res.ok) throw new Error("Gagal mengaktifkan periode");
      queryClient.invalidateQueries({ queryKey: ["periode"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ---- User Handlers ----
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    try {
      const url = editingUserId ? `/api/users/${editingUserId}` : "/api/users";
      const method = editingUserId ? "PATCH" : "POST";

      const body: any = {
        namaLengkap: userName,
        username: userUsername,
        role: userRole,
      };
      if (userPassword) body.password = userPassword;
      if (userRole === "user") body.unitId = userUnitId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal menyimpan user");
      }
      closeUserForm();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingUser(false);
    }
  };

  const openEditUser = (u: any) => {
    setEditingUserId(u._id);
    setUserName(u.namaLengkap);
    setUserUsername(u.username);
    setUserPassword("");
    setUserRole(u.role);
    setUserUnitId(u.unitId?._id || "");
    setIsCreatingUser(true);
  };

  const closeUserForm = () => {
    setIsCreatingUser(false);
    setEditingUserId(null);
    setUserName("");
    setUserUsername("");
    setUserPassword("");
    setUserRole("user");
    setUserUnitId("");
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Hapus user ini?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal menghapus user");
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ---- Unit Handlers ----
  const handleAddUnit = async () => {
    if (!newUnitName.trim()) return;
    setAddingUnit(true);
    try {
      const res = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaUnit: newUnitName.trim() })
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal menambah unit");
      }
      setNewUnitName("");
      queryClient.invalidateQueries({ queryKey: ["units"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddingUnit(false);
    }
  };

  const deleteUnit = async (id: string) => {
    if (!confirm("Hapus unit ini?")) return;
    try {
      const res = await fetch(`/api/units/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus unit");
      queryClient.invalidateQueries({ queryKey: ["units"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const periodeProps = {
    isCreating, setIsCreating,
    editingPeriodeId, setEditingPeriodeId,
    semester, setSemester,
    tahunAjaran, setTahunAjaran,
    paguMaster, setPaguMaster,
    submitting,
    handleCreate: handleCreatePeriode,
    toggleActive, openEditPeriode,
    periodes, isLoadingPeriodes,
  };

  const userProps = {
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
    newUnitName, setNewUnitName,
    addingUnit, handleAddUnit, deleteUnit,
  };

  const props = {
    session,
    activeTab, setActiveTab,
    ...periodeProps,
    ...userProps,
  };

  if (theme === "theme-brutalism") {
    return <SettingsBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <SettingsMinimalist {...props} />;
  }

  return <SettingsDefault {...props} />;
}
