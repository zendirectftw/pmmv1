"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Aureate
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/listings"
            className="text-sm text-[var(--foreground)] hover:text-[var(--gold)] transition"
          >
            Marketplace
          </Link>
          {status === "loading" ? (
            <span className="text-sm text-[var(--muted)]">…</span>
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-[var(--foreground)] hover:text-[var(--gold)] transition"
              >
                Dashboard
              </Link>
              {(session.user as { role?: string })?.role === "SELLER" && (
                <Link
                  href="/listings/create"
                  className="text-sm text-[var(--foreground)] hover:text-[var(--gold)] transition"
                >
                  Sell
                </Link>
              )}
              {(session.user as { role?: string })?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm text-[var(--foreground)] hover:text-[var(--gold)] transition"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm text-[var(--foreground)] hover:text-[var(--gold)] transition"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-[var(--gold)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
