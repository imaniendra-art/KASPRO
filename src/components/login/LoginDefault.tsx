import { useLogin } from "./useLogin";
import { Wallet, Loader2, LogIn, Lock, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function LoginDefault() {
  const { username, setUsername, password, setPassword, error, isLoading, handleSubmit } = useLogin();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 backdrop-blur-md hover:scale-110 transition-all duration-300 z-50 shadow-sm"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 dark:bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[60%] h-[60%] bg-emerald-600/10 dark:bg-emerald-600/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 dark:via-white/30 to-transparent"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transform transition-transform hover:scale-105 hover:rotate-3 duration-300">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">KASPRO STIMI</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">Kelola Anggaran & Sistem Proker</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl text-center backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm dark:shadow-none"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-sm dark:shadow-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="flex items-center justify-center space-x-2 relative z-10">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
