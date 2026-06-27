"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderKanban, Loader2, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import ProkerDefault from "@/components/proker/themes/ProkerDefault";
import ProkerBrutalism from "@/components/proker/themes/ProkerBrutalism";
import ProkerMinimalist from "@/components/proker/themes/ProkerMinimalist";

const fetchProker = async () => {
  const res = await fetch("/api/proker");
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json;
};



export default function DaftarProker() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [capaian, setCapaian] = useState("");
  const [baseLine, setBaseLine] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState("");
  const [sasaran, setSasaran] = useState("");
  const [pesertaMitra, setPesertaMitra] = useState("");
  const [rab, setRab] = useState<any[]>([{ namaItem: "", jumlah: 1, satuan: "", hargaSatuan: 0, total: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["proker"],
    queryFn: fetchProker
  });

  const handleRabChange = (index: number, field: string, value: any) => {
    const newRab = [...rab];
    newRab[index][field] = value;
    if (field === "jumlah" || field === "hargaSatuan") {
      newRab[index].total = Number(newRab[index].jumlah) * Number(newRab[index].hargaSatuan);
    }
    setRab(newRab);
  };

  const addRabItem = () => {
    setRab([...rab, { namaItem: "", jumlah: 1, satuan: "", hargaSatuan: 0, total: 0 }]);
  };

  const removeRabItem = (index: number) => {
    if (rab.length > 1) {
      setRab(rab.filter((_, i) => i !== index));
    }
  };

  const openEditModal = (item: any) => {
    setEditingId(item._id);
    setJudul(item.judul);
    setDeskripsi(item.deskripsi || "");
    setCapaian(item.capaian || "");
    setBaseLine(item.baseLine || 0);
    setTarget(item.target || 0);
    setWaktuPelaksanaan(item.waktuPelaksanaan || "");
    setSasaran(item.sasaran || "");
    setPesertaMitra(item.pesertaMitra || "");
    setRab(item.rab && item.rab.length > 0 ? item.rab : [{ namaItem: "", jumlah: 1, satuan: "", hargaSatuan: 0, total: 0 }]);
    setIsCreating(true);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setJudul("");
    setDeskripsi("");
    setCapaian("");
    setBaseLine(0);
    setTarget(0);
    setWaktuPelaksanaan("");
    setSasaran("");
    setPesertaMitra("");
    setRab([{ namaItem: "", jumlah: 1, satuan: "", hargaSatuan: 0, total: 0 }]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/proker/${editingId}` : "/api/proker";
      const method = editingId ? "PATCH" : "POST";
      
      // Hitung ulang estimasi anggaran total
      const totalEstimasi = rab.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi, capaian, baseLine, target, waktuPelaksanaan, sasaran, pesertaMitra, rab, estimasiAnggaran: totalEstimasi })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      closeForm();
      queryClient.invalidateQueries({ queryKey: ["proker"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const ajukanKeKeuangan = async (id: string) => {
    if (!confirm("Kirim draf ini ke Keuangan untuk divalidasi?")) return;
    try {
      const res = await fetch(`/api/proker/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Menunggu Validasi" })
      });
      if (!res.ok) throw new Error("Gagal mengajukan");
      queryClient.invalidateQueries({ queryKey: ["proker"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const kirimSemuaAjuan = async () => {
    const drafts = data?.data?.filter((item: any) => item.status === "Draft") || [];
    if (drafts.length === 0) {
      alert("Tidak ada draf yang bisa diajukan.");
      return;
    }
    if (!confirm(`Kirim ${drafts.length} draf proker ke Keuangan untuk divalidasi?`)) return;
    try {
      await Promise.all(drafts.map((d: any) => 
        fetch(`/api/proker/${d._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Menunggu Validasi" })
        })
      ));
      queryClient.invalidateQueries({ queryKey: ["proker"] });
      alert("Semua draf berhasil diajukan!");
    } catch (err: any) {
      alert("Terjadi kesalahan saat mengajukan draf.");
    }
  };

  const hapusDraft = async (id: string) => {
    if (!confirm("Hapus draf proker ini?")) return;
    try {
      const res = await fetch(`/api/proker/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus");
      queryClient.invalidateQueries({ queryKey: ["proker"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleValidasi = async (id: string, status: string, estimasiAnggaran: number, catatan: string, rab?: any[]) => {
    try {
      const res = await fetch(`/api/proker/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, estimasiAnggaran, catatan, rab })
      });
      if (!res.ok) throw new Error("Gagal memvalidasi proker");
      queryClient.invalidateQueries({ queryKey: ["proker"] });
    } catch (err: any) {
      alert(err.message);
      throw err;
    }
  };

  const { theme } = useTheme();

  const prokerData = data?.data || [];
  const hasActivePeriode = data?.hasActivePeriode || false;

  const props = {
    data: prokerData, hasActivePeriode, isLoading, error, session,
    isCreating, setIsCreating,
    judul, setJudul, deskripsi, setDeskripsi,
    capaian, setCapaian, baseLine, setBaseLine, target, setTarget,
    waktuPelaksanaan, setWaktuPelaksanaan, sasaran, setSasaran, pesertaMitra, setPesertaMitra,
    rab, setRab, handleRabChange, addRabItem, removeRabItem,
    submitting, handleCreate, ajukanKeKeuangan, kirimSemuaAjuan, hapusDraft, handleValidasi, openEditModal
  };

  if (theme === "theme-brutalism") {
    return <ProkerBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <ProkerMinimalist {...props} />;
  }

  return <ProkerDefault {...props} />;
}
