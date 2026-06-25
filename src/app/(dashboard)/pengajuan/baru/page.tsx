"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, Loader2, ArrowLeft, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import PengajuanBaruDefault from "@/components/pengajuan/themes/PengajuanBaruDefault";
import PengajuanBaruBrutalism from "@/components/pengajuan/themes/PengajuanBaruBrutalism";
import PengajuanBaruMinimalist from "@/components/pengajuan/themes/PengajuanBaruMinimalist";

export default function BuatPengajuanBaru() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [prokerId, setProkerId] = useState("");

  const { data: prokers } = useQuery({
    queryKey: ["proker"],
    queryFn: async () => {
      const res = await fetch("/api/proker");
      if (!res.ok) throw new Error("Gagal mengambil data proker");
      const json = await res.json();
      return json.data.filter((p: any) => p.status === "Divalidasi Keuangan");
    }
  });
  
  const [rab, setRab] = useState([
    { namaItem: "", jumlah: 1, satuan: "Pcs", hargaSatuan: 0, total: 0, file: null as File | null }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRabChange = (index: number, field: string, value: string | number | File | null) => {
    const newRab = [...rab];
    (newRab[index] as any)[field] = value;
    
    // Auto calculate total
    if (field === "jumlah" || field === "hargaSatuan") {
      newRab[index].total = Number(newRab[index].jumlah) * Number(newRab[index].hargaSatuan);
    }
    
    setRab(newRab);
  };

  const addRabItem = () => {
    setRab([...rab, { namaItem: "", jumlah: 1, satuan: "Pcs", hargaSatuan: 0, total: 0, file: null }]);
  };

  const removeRabItem = (index: number) => {
    if (rab.length > 1) {
      const newRab = rab.filter((_, i) => i !== index);
      setRab(newRab);
    }
  };

  const totalNominal = rab.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      if (prokerId) {
        formData.append("prokerId", prokerId);
      }
      
      const rabData = rab.map(item => ({
        namaItem: item.namaItem,
        jumlah: item.jumlah,
        satuan: item.satuan,
        hargaSatuan: item.hargaSatuan,
        total: item.total,
      }));
      formData.append("rab", JSON.stringify(rabData));
      
      rab.forEach((item, index) => {
        if (item.file) {
          formData.append(`file_${index}`, item.file);
        }
      });

      const res = await fetch("/api/pengajuan", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Gagal membuat pengajuan");
      }

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["pengajuan"] });
      
      setTimeout(() => {
        router.push("/pengajuan");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const { theme } = useTheme();

  const props = {
    judul, setJudul,
    deskripsi, setDeskripsi,
    prokerId, setProkerId,
    prokers,
    rab, handleRabChange, addRabItem, removeRabItem, totalNominal,
    handleSubmit, isSubmitting, error, success
  };

  if (theme === "theme-brutalism") {
    return <PengajuanBaruBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <PengajuanBaruMinimalist {...props} />;
  }

  return <PengajuanBaruDefault {...props} />;
}
