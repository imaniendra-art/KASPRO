import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white flex theme-default-wrapper transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto relative">
           <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="relative z-10">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
