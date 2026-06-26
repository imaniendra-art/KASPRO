"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import DashboardDefault from "@/components/dashboard/themes/DashboardDefault";
import DashboardBrutalism from "@/components/dashboard/themes/DashboardBrutalism";

import DashboardMinimalist from "@/components/dashboard/themes/DashboardMinimalist";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Gagal load stats");
      return (await res.json()).data;
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Fallback to 0 if stats fail
  const safeStats = stats || { totalKas: 0, sisaKas: 0, totalPengeluaran: 0, persentaseTerpakai: 0 };

  switch (theme) {
    case "theme-brutalism":
      return <DashboardBrutalism session={session} stats={safeStats} />;

    case "theme-minimalist":
      return <DashboardMinimalist session={session} stats={safeStats} />;
    default:
      return <DashboardDefault session={session} stats={safeStats} />;
  }
}
