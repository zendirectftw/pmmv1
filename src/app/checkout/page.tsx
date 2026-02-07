"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("listingId");
  const [listing, setListing] = useState<{
    id: string;
    title: string;
    metal: string;
    weightOz: number;
    priceUsd: number;
    images: string[];
  } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listingId) {
      setLoading(false);
      setError("Missing listing");
      return;
    }
    Promise.all([
      fetch(`/api/listings/${listingId}`).then((r) => (r.ok ? r.json() : null)),
    ]).then(([listingData]) => {
      setListing(listingData);
      setLoading(false);
    });
  }, [listingId]);

  async function startCheckout() {
    if (!listingId || !listing) return;
    setError("");
    setPayLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, quantity: 1 }),
    });
    const data = await res.json().catch(() => ({}));
    setPayLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create order");
      return;
    }
    setOrderId(data.orderId);
    setClientSecret(data.clientSecret);
    if (!data.clientSecret) {
      setError("Stripe not configured. Order created for testing.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">Loading…</main>
      </div>
    );
  }
  if (!listing || !listingId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[var(--muted)]">Listing not found.</p>
            <Link href="/listings" className="text-[var(--gold)] mt-2 inline-block">Back to marketplace</Link>
          </div>
        </main>
      </div>
    );
  }

  const totalCents = Math.round(listing.priceUsd * 100);
  const totalDollars = (totalCents / 100).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Checkout</h1>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg bg-[var(--border)]/30 flex-shrink-0 overflow-hidden">
              {listing.images[0] ? (
                <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-[var(--muted)] text-sm">{listing.metal}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-[var(--gold)]">{listing.metal}</p>
              <h2 className="font-medium text-[var(--foreground)]">{listing.title}</h2>
              <p className="text-[var(--muted)] text-sm">{listing.weightOz} oz × 1</p>
              <p className="text-lg font-semibold text-[var(--foreground)] mt-1">
                ${totalDollars}
              </p>
            </div>
          </div>
          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded-md">{error}</p>
          )}
          {!orderId ? (
            <button
              type="button"
              onClick={startCheckout}
              disabled={payLoading}
              className="mt-6 w-full rounded-lg bg-[var(--gold)] py-3 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {payLoading ? "Creating order…" : "Pay with Stripe"}
            </button>
          ) : clientSecret ? (
            <div className="mt-6">
              <p className="text-sm text-[var(--muted)] mb-2">
                Redirecting to Stripe Checkout… Or embed Stripe Elements here with clientSecret.
              </p>
              <CheckoutForm clientSecret={clientSecret} orderId={orderId} onSuccess={() => router.push("/dashboard/orders")} />
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-[var(--muted)]">Order #{orderId} created (test mode).</p>
              <Link href="/dashboard/orders" className="mt-2 inline-block text-[var(--gold)]">View orders</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CheckoutForm({
  clientSecret,
  orderId,
  onSuccess,
}: {
  clientSecret: string;
  orderId: string;
  onSuccess: () => void;
}) {
  // TODO: Embed @stripe/react-stripe-js and Elements with clientSecret; on payment success call onSuccess().
  return (
    <div className="rounded-lg border border-[var(--border)] p-4 bg-[var(--background)]">
      <p className="text-sm text-[var(--foreground)]">Order ID: {orderId}</p>
      <p className="text-xs text-[var(--muted)] mt-1">
        Add Stripe Elements (CardElement) and confirmPayment with clientSecret to complete payment. On success, webhook sets order to PAID_ESCROW.
      </p>
      <a
        href="/dashboard/orders"
        className="mt-3 inline-block text-sm text-[var(--gold)] hover:underline"
      >
        Go to my orders →
      </a>
    </div>
  );
}
