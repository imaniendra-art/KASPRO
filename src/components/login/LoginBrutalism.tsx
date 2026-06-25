import { useLogin } from "./useLogin";
import { Loader2 } from "lucide-react";

export default function LoginBrutalism() {
  const { username, setUsername, password, setPassword, error, isLoading, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-[#e5ff00] text-black font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[8px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-widest mb-1">Auth / KASPRO</div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">LOGIN</h1>
          <p className="text-lg font-bold uppercase border-b-[4px] border-black pb-4">Sistem Anggaran</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500 text-white font-bold p-4 border-[4px] border-black uppercase text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xl font-black uppercase tracking-tighter">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border-[4px] border-black p-4 text-xl font-bold placeholder-gray-400 focus:outline-none focus:bg-[#e5ff00]"
              placeholder="USERNAME"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-black uppercase tracking-tighter">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-[4px] border-black p-4 text-xl font-bold placeholder-gray-400 focus:outline-none focus:bg-[#e5ff00]"
              placeholder="PASSWORD"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-[#e5ff00] hover:text-black border-[4px] border-black p-4 text-2xl font-black uppercase tracking-tighter transition-colors mt-4"
          >
            {isLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : "MASUK SEKARANG"}
          </button>
        </form>
      </div>
    </div>
  );
}
