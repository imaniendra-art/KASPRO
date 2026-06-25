import { useLogin } from "./useLogin";
import { Loader2 } from "lucide-react";

export default function LoginMesh() {
  const { username, setUsername, password, setPassword, error, isLoading, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Complex Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-rose-500/40 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/40 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80%] h-[80%] bg-violet-600/30 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">KASPRO</h1>
          <p className="text-white/60">Sistem Anggaran Terpadu</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-rose-500/20 text-rose-300 border border-rose-500/50 p-4 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black rounded-xl p-4 font-bold text-lg hover:bg-white/90 transition-colors mt-2 flex items-center justify-center h-14"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
