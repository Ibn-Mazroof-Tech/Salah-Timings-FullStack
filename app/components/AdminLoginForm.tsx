"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Login failed");
      }

      router.push("/admin/mosques");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        disabled={loading}
        className="w-full rounded-lg bg-[#e6f0ff] text-[#0b1d3a] font-semibold py-2 disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
