"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import AboutDefault from "./themes/AboutDefault";
import AboutBrutalism from "./themes/AboutBrutalism";
import AboutMinimalist from "./themes/AboutMinimalist";

export default function AboutWrapper({ session }: { session: any }) {
  // We need to fetch the current active theme, similar to how ThemeWrapper works
  const { data: theme, isLoading } = useQuery({
    queryKey: ["activeTheme"],
    queryFn: async () => {
      const res = await fetch("/api/theme");
      if (!res.ok) return "theme-default";
      const json = await res.json();
      return json.data?.activeTheme || "theme-default";
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const props = { session };

  switch (theme) {
    case "theme-brutalism":
      return <AboutBrutalism {...props} />;
    case "theme-minimalist":
      return <AboutMinimalist {...props} />;
    case "theme-default":
    default:
      return <AboutDefault {...props} />;
  }
}
