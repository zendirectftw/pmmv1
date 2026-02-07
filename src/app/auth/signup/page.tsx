"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: name || undefined, role }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }
    router.push("/auth/signin?callbackUrl=/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Aureate
          </Link>
          <p className="text-[var(--muted)] mt-1">Create your account</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
        >
          {error && (
            <p className="text-red-600 text-sm mb-4 rounded-md bg-red-50 dark:bg-red-950/30 p-2">
              {error}
            </p>
          )}
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] mb-4"
            placeholder="Your name"
          />
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] mb-4"
            placeholder="you@example.com"
          />
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Password (min 8 characters)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] mb-4"
          />
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            I want to
          </label>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                checked={role === "BUYER"}
                onChange={() => setRole("BUYER")}
                className="text-[var(--gold)]"
              />
              <span>Buy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                checked={role === "SELLER"}
                onChange={() => setRole("SELLER")}
                className="text-[var(--gold)]"
              />
              <span>Sell</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--gold)] py-2.5 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
          <p className="text-center text-sm text-[var(--muted)] mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-[var(--gold)] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
