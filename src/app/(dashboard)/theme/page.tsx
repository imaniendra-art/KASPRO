"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, Monitor, Layout, Box, Sparkles, Droplet, ArrowLeft } from "lucide-react";
import ThemeDefault from "@/components/theme/themes/ThemeDefault";
import ThemeBrutalism from "@/components/theme/themes/ThemeBrutalism";
import ThemeMinimalist from "@/components/theme/themes/ThemeMinimalist";

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let themes = [
    { id: "theme-default", name: "Glassmorphism (Default)", icon: Droplet, desc: "Tema premium dengan efek blur dan sidebar." },
    { id: "theme-brutalism", name: "Brutalism", icon: Layout, desc: "Monochrome, font besar, border tebal, tanpa sidebar." },

    { id: "theme-minimalist", name: "Minimalist SaaS", icon: Monitor, desc: "Bersih, cerah, profesional, tanpa sidebar." },
  ];

  if (session?.user?.role === "ketua") {
    themes = themes.filter(t => t.id === "theme-default" || t.id === "theme-minimalist");
  }

  const props = { theme, setTheme, themes };

  if (theme === "theme-brutalism") {
    return <ThemeBrutalism {...props} />;
  }
  if (theme === "theme-minimalist") {
    return <ThemeMinimalist {...props} />;
  }

  return <ThemeDefault {...props} />;
}
