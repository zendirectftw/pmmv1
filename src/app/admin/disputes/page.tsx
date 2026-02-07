import { prisma } from "@/lib/db";

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: { select: { id: true, totalAmountCents: true } },
      buyer: { select: { email: true } },
      seller: { select: { email: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Disputes</h1>
      <p className="text-[var(--muted)] mt-1">Handle buyer-seller disputes</p>
      {disputes.length === 0 ? (
        <p className="text-[var(--muted)] py-12">No disputes.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <p className="font-medium text-[var(--foreground)]">Order: {d.orderId.slice(0, 8)}…</p>
              <p className="text-sm text-[var(--muted)]">Buyer: {d.buyer.email} · Seller: {d.seller.email}</p>
              <p className="text-sm mt-2">{d.reason}</p>
              <p className="text-xs text-[var(--muted)] mt-2">Status: {d.status}</p>
              {d.adminNotes && <p className="text-sm mt-2 text-[var(--muted)]">Notes: {d.adminNotes}</p>}
              {/* TODO: Add form to update status and admin notes */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
