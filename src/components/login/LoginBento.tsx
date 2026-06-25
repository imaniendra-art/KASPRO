import { useLogin } from "./useLogin";
import { Loader2, Wallet } from "lucide-react";

export default function LoginBento() {
  const { username, setUsername, password, setPassword, error, isLoading, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-[#f2f2f7] text-black font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Bento Box */}
        <div className="bg-blue-600 rounded-[32px] p-10 flex flex-col justify-between text-white shadow-lg hidden md:flex">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Selamat Datang di KASPRO</h1>
            <p className="text-blue-100 text-lg">Sistem informasi manajemen anggaran dan program kerja yang terintegrasi penuh.</p>
          </div>
        </div>

        {/* Right Bento Box (Login Form) */}
        <div className="bg-white rounded-[32px] p-10 shadow-lg flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Masuk</h2>
          <p className="text-gray-500 mb-8">Silakan masukkan kredensial Anda.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white rounded-2xl p-4 font-bold text-lg hover:bg-gray-800 transition-colors mt-4 flex items-center justify-center h-16"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Masuk ke Sistem"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
