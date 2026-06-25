"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, FileText, Loader2, Clock, CheckCircle, XCircle, Upload } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import PengajuanDefault from "@/components/pengajuan/themes/PengajuanDefault";
import PengajuanBrutalism from "@/components/pengajuan/themes/PengajuanBrutalism";
import PengajuanMinimalist from "@/components/pengajuan/themes/PengajuanMinimalist";

const fetchPengajuan = async () => {
  const res = await fetch("/api/pengajuan");
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json.data;
};



export default function DaftarPengajuanSaya() {
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pengajuan"],
    queryFn: fetchPengajuan
  });

  const handleUploadBukti = async (id: string, file: File | null) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("bukti", file);

      const res = await fetch(`/api/pengajuan/${id}/bukti`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal mengunggah bukti");
      }

      alert("Bukti berhasil diunggah! Status pengajuan kini Selesai.");
      queryClient.invalidateQueries({ queryKey: ["pengajuan"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const { theme } = useTheme();

  const props = {
    data,
    isLoading,
    error,
    uploadingId,
    handleUploadBukti
  };

  if (theme === "theme-brutalism") {
    return <PengajuanBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <PengajuanMinimalist {...props} />;
  }

  return <PengajuanDefault {...props} />;
}
