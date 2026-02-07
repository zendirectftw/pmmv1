import { prisma } from "@/lib/db";
import { Dispute } from "@prisma/client";

export default async function AdminDashboardPage() {
  const [userCount, listingCount, orderCount, completedOrders, disputeCount] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.order.count(),
    prisma.order.findMany({ 
      where: { status: "COMPLETED" }, 
      select: { totalAmountCents: true, platformFeeCents: true } 
    }),
    prisma.dispute.findMany({ where: { status: "OPEN" } }),
  ]);

  const gmv = completedOrders.reduce((s, o) => s + o.totalAmountCents, 0) / 100;
  const revenue = completedOrders.reduce((s, o) => s + (o.platformFeeCents ?? 0), 0) / 100;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Admin</h1>
      <p className="text-[var(--muted)] mt-1">Platform overview</p>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted)]">Users</p>
          <p className="text-2xl font-semibold text-[var(--foreground)]">{userCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted)]">Active listings</p>
          <p className="text-2xl font-semibold text-[var(--foreground)]">{listingCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted)]">GMV (completed)</p>
          <p className="text-2xl font-semibold text-[var(--foreground)]">
            ${gmv.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted)]">Platform revenue</p>
          <p className="text-2xl font-semibold text-[var(--foreground)]">
            ${revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Open Disputes</h2>
        {disputeCount.length === 0 ? (
          <p className="text-[var(--muted)]">No open disputes found.</p>
        ) : (
          <div className="space-y-4">
            {disputeCount.map((d: Dispute) => (
              <div
                key={d.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Dispute #{d.id.slice(-6)}</p>
                    <p className="text-sm text-[var(--muted)]">Status: {d.status}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-[var(--muted)] mt-6">Total orders: {orderCount}</p>
      </div>
    </div>
  );
}