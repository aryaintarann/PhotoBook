"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah. Coba lagi ya 🥺");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
          placeholder="email@kamu.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-[#3d2b1f] text-white rounded-md hover:bg-[#5c3d2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
