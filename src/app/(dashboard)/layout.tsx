"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "next";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto relative">
           {/* Global Subtle Background Gradients for Main Content */}
           <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="relative z-10">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
