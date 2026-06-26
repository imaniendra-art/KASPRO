"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import BrutalismLayout from "@/components/layouts/BrutalismLayout";

import MinimalistLayout from "@/components/layouts/MinimalistLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (!mounted) {
    return <DefaultLayout>{children}</DefaultLayout>;
  }

  switch (theme) {
    case "theme-brutalism":
      return <BrutalismLayout>{children}</BrutalismLayout>;

    case "theme-minimalist":
      return <MinimalistLayout>{children}</MinimalistLayout>;
    default:
      return <DefaultLayout>{children}</DefaultLayout>;
  }
}
