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

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [semester, setSemester] = useState("Ganjil");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [paguMaster, setPaguMaster] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: periodes, isLoading: isLoadingPeriodes } = useQuery({
    queryKey: ["periode"],
    queryFn: async () => {
      const res = await fetch("/api/periode");
      if (!res.ok) throw new Error("Gagal mengambil periode");
      return (await res.json()).data;
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          semester,
          tahunAjaran,
          paguMaster: Number(paguMaster),
          isActive: false // manually active later
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setIsCreating(false);
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

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    if (currentlyActive) return; // Prevent turning off without turning on another
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

  const props = {
    session,
    periodes, isLoadingPeriodes,
    isCreating, setIsCreating,
    semester, setSemester,
    tahunAjaran, setTahunAjaran,
    paguMaster, setPaguMaster,
    submitting, handleCreate, toggleActive
  };

  if (theme === "theme-brutalism") {
    return <SettingsBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <SettingsMinimalist {...props} />;
  }

  return <SettingsDefault {...props} />;
}
