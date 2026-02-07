"use client";

import { useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  listing: { id: string; title: string; metal: string; images: string[]; priceUsd: number };
  quantity: number;
  totalAmountCents: number;
  status: string;
  trackingNumber: string | null;
  trackingCarrier: string | null;
  shippedAt: string | null;
  createdAt: string;
  role: "buyer" | "seller";
  otherParty: { name: string | null };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending payment",
  PAID_ESCROW: "Paid (in escrow)",
  SELLER_SHIPPING: "Shipping",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  BUYER_CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  DISPUTED: "Disputed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export function OrdersList({ orders }: { orders: Order[] }) {
  const [shipping, setShipping] = useState<Record<string, boolean>>({});
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [carrier, setCarrier] = useState<Record<string, string>>({});

  async function submitShip(orderId: string) {
    setShipping((s) => ({ ...s, [orderId]: true }));
    const res = await fetch(`/api/orders/${orderId}/ship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingNumber: tracking[orderId] || "1Z999AA10123456784",
        trackingCarrier: carrier[orderId] || undefined,
      }),
    });
    setShipping((s) => ({ ...s, [orderId]: false }));
    if (res.ok) window.location.reload();
  }

  async function confirmDelivery(orderId: string) {
    const res = await fetch(`/api/orders/${orderId}/confirm`, { method: "POST" });
    if (res.ok) window.location.reload();
  }

  if (orders.length === 0) {
    return (
      <p className="text-[var(--muted)] py-12">
        No orders yet. <Link href="/listings" className="text-[var(--gold)] hover:underline">Browse marketplace</Link>
      </p>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-wrap items-center gap-4"
        >
          <Link href={`/listings/${order.listing.id}`} className="flex gap-3 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-lg bg-[var(--border)]/30 flex-shrink-0 overflow-hidden">
              {order.listing.images[0] ? (
                <img src={order.listing.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-[var(--muted)] text-xs">{order.listing.metal}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[var(--foreground)] truncate">{order.listing.title}</p>
              <p className="text-sm text-[var(--muted)]">
                ${(order.totalAmountCents / 100).toFixed(2)} · {order.role === "buyer" ? "From" : "To"}: {order.otherParty.name ?? "—"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {STATUS_LABELS[order.status] ?? order.status} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {order.role === "seller" && order.status === "PAID_ESCROW" && (
              <>
                <input
                  type="text"
                  placeholder="Tracking number"
                  value={tracking[order.id] ?? ""}
                  onChange={(e) => setTracking((t) => ({ ...t, [order.id]: e.target.value }))}
                  className="rounded border border-[var(--border)] px-2 py-1 text-sm w-40"
                />
                <input
                  type="text"
                  placeholder="Carrier"
                  value={carrier[order.id] ?? ""}
                  onChange={(e) => setCarrier((c) => ({ ...c, [order.id]: e.target.value }))}
                  className="rounded border border-[var(--border)] px-2 py-1 text-sm w-24"
                />
                <button
                  type="button"
                  onClick={() => submitShip(order.id)}
                  disabled={shipping[order.id]}
                  className="rounded-lg bg-[var(--gold)] px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:opacity-50"
                >
                  Mark shipped
                </button>
              </>
            )}
            {order.role === "buyer" && ["SELLER_SHIPPING", "SHIPPED", "DELIVERED"].includes(order.status) && (
              <button
                type="button"
                onClick={() => confirmDelivery(order.id)}
                className="rounded-lg bg-[var(--gold)] px-3 py-1.5 text-sm text-white hover:opacity-90"
              >
                Confirm delivery
              </button>
            )}
            {order.trackingNumber && (
              <span className="text-xs text-[var(--muted)]">
                Track: {order.trackingNumber}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
