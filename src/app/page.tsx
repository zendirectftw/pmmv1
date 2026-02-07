import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
              Precious metals, <span className="text-[var(--gold)]">trusted</span> marketplace
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl mx-auto">
              Buy and sell gold, silver, platinum, and palladium with escrow protection and live spot prices.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/listings"
                className="rounded-lg bg-[var(--gold)] px-6 py-3 font-medium text-white hover:opacity-90 transition"
              >
                Browse marketplace
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg border border-[var(--border)] px-6 py-3 font-medium text-[var(--foreground)] hover:bg-[var(--border)]/50 transition"
              >
                Start selling
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-8">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] p-6">
              <div className="text-[var(--gold)] font-semibold">1. List or browse</div>
              <p className="mt-2 text-[var(--muted)]">
                Sellers list bullion with weight, price, and premium. Buyers filter by metal and condition.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-6">
              <div className="text-[var(--gold)] font-semibold">2. Secure checkout</div>
              <p className="mt-2 text-[var(--muted)]">
                Payment is held in escrow via Stripe. Funds release only after you confirm delivery.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-6">
              <div className="text-[var(--gold)] font-semibold">3. Ship & confirm</div>
              <p className="mt-2 text-[var(--muted)]">
                Seller ships with tracking. Buyer confirms receipt and funds are released to the seller.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
