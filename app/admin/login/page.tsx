"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password");
        setLoading(false);
        return;
      }

      const from = searchParams.get("from") || "/admin/orders";
      router.push(from);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8E4] px-4">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#1D3C42]/10">
          <Lock size={24} className="text-[#1D3C42]" />
        </div>
        <h1 className="mt-4 text-center font-display text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D3C42]">
          Admin Login
        </h1>
        <p className="mt-1 text-center text-[15px] text-[#7A6262]">
          Enter the admin password to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#1D3C42]"
            />
          </div>

          {error && (
            <p className="text-center text-xs font-semibold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-full bg-[#1D3C42] px-8 py-3 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#163136] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
