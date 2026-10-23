"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Sign in failed.");
        return;
      }
      setPassword("");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="max-w-md mx-auto px-6 py-24 md:py-32">
        <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">Admin</p>
        <h1 className="font-display text-5xl leading-[1] text-ink mb-10">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="password" className="block text-xs tracking-[0.2em] uppercase text-stone mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-ink/30 focus:border-navy py-3 font-display text-xl text-ink outline-none transition-colors"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-navy text-cream px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-navy-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
