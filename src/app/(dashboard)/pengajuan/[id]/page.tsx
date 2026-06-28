"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import PengajuanDetailDefault from "@/components/pengajuan/themes/PengajuanDetailDefault";
import PengajuanDetailBrutalism from "@/components/pengajuan/themes/PengajuanDetailBrutalism";
import PengajuanDetailMinimalist from "@/components/pengajuan/themes/PengajuanDetailMinimalist";

const fetchDetail = async (id: string) => {
  const res = await fetch(`/api/pengajuan/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Review Admin": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Menunggu Ketua": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Disetujui Ketua": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Dicairkan": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Ditolak": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Selesai": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function DetailPengajuan() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const { data, isLoading, error } = useQuery({
    queryKey: ["pengajuan", params.id],
    queryFn: () => fetchDetail(params.id as string)
  });

  const { theme } = useTheme();
  const isOwner = session?.user?.id === data?.data?.pengusulId?._id;

  const [catatanUmum, setCatatanUmum] = useState("");
  const [catatanAdmin, setCatatanAdmin] = useState("");
  const [catatanUser, setCatatanUser] = useState("");
  const [nominalDisetujui, setNominalDisetujui] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedRab, setEditedRab] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data?.rab) {
      setEditedRab(data.data.rab);
      const sum = data.data.rab.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);
      setNominalDisetujui(sum);
    }
  }, [data]);

  const handleAction = async (aksi: string, newStatus: string) => {
    setIsSubmitting(true);
    try {
      const payload = {
        status: newStatus,
        aksi,
        catatanUmum,
        catatanAdmin,
        catatanUser,
        totalDisetujui: nominalDisetujui || data.data.totalNominal,
        potongPaguMaster: !!data.data.prokerId,
        rab: editedRab
      };

      const res = await fetch(`/api/pengajuan/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Gagal mengupdate");
      }
      
      queryClient.invalidateQueries({ queryKey: ["pengajuan"] });
      queryClient.invalidateQueries({ queryKey: ["semua_pengajuan"] });
      setCatatanUmum("");
      setCatatanAdmin("");
      setCatatanUser("");
      
    } catch (err) {
      alert("Terjadi kesalahan: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadBukti = async (file: File | null) => {
    if (!file) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("bukti", file);

      const res = await fetch(`/api/pengajuan/${params.id}/bukti`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal mengunggah bukti");
      }

      alert("Bukti berhasil diunggah! Status pengajuan kini Selesai.");
      queryClient.invalidateQueries({ queryKey: ["pengajuan", params.id] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-400">Memuat detail pengajuan...</p>
    </div>
  );

  if (error || !data) return (
    <div className="p-8 text-center text-red-400">Gagal memuat detail.</div>
  );

  const p = data.data;
  const logs = data.logs;

  const handleEditRabItem = (index: number, field: string, value: any) => {
    const newRab = [...editedRab];
    newRab[index][field] = value;
    if (field === "jumlah" || field === "hargaSatuan") {
      newRab[index].total = Number(newRab[index].jumlah || 0) * Number(newRab[index].hargaSatuan || 0);
    }
    setEditedRab(newRab);
    const sum = newRab.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);
    setNominalDisetujui(sum);
  };

  const handleDeleteRabItem = (index: number) => {
    const newRab = editedRab.filter((_, i) => i !== index);
    setEditedRab(newRab);
    const sum = newRab.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);
    setNominalDisetujui(sum);
  };

  const isAdmin = role === "admin";
  const isKetua = role === "ketua";
  const needsAdminAction = isAdmin && p.status === "Review Admin";
  const needsKetuaAction = isKetua && p.status === "Menunggu Ketua";
  const needsCairAction = isAdmin && p.status === "Disetujui Ketua";

  const props = {
    p, logs,
    isAdmin, isKetua,
    needsAdminAction, needsKetuaAction, needsCairAction,
    catatanUmum, setCatatanUmum,
    catatanAdmin, setCatatanAdmin,
    catatanUser, setCatatanUser,
    nominalDisetujui, setNominalDisetujui,
    isSubmitting, handleAction, handleUploadBukti, getStatusColor,
    editedRab, handleEditRabItem, handleDeleteRabItem
  };

  if (theme === "theme-brutalism") {
    return <PengajuanDetailBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <PengajuanDetailMinimalist {...props} />;
  }

  return <PengajuanDetailDefault {...props} />;
}
