"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import LoginDefault from "@/components/login/LoginDefault";
import LoginBrutalism from "@/components/login/LoginBrutalism";
import LoginBento from "@/components/login/LoginBento";
import LoginMesh from "@/components/login/LoginMesh";
import LoginMinimalist from "@/components/login/LoginMinimalist";

export default function LoginPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoginDefault />;
  }

  switch (theme) {
    case "theme-brutalism":
      return <LoginBrutalism />;
    case "theme-bento":
      return <LoginBento />;
    case "theme-mesh":
      return <LoginMesh />;
    case "theme-minimalist":
      return <LoginMinimalist />;
    default:
      return <LoginDefault />;
  }
}
