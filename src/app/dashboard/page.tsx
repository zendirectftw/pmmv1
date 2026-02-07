import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/auth/signin");

  const [wallet, ordersCount, listingsCount] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.order.count({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    }),
    prisma.listing.count({ where: { sellerId: userId, status: "ACTIVE" } }),
  ]);

  const balance = wallet ? (wallet.balanceCents + wallet.pendingCents) / 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
      <p className="text-[var(--muted)] mt-1">Welcome back, {session.user.name ?? session.user.email}</p>
      <div className="grid gap-4 sm:grid-cols-3 mt-8">
        <Link
          href="/dashboard/wallet"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--gold)]/50 transition"
        >
          <p className="text-sm text-[var(--muted)]">Wallet balance</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">
            ${balance.toFixed(2)}
          </p>
        </Link>
        <Link
          href="/dashboard/orders"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--gold)]/50 transition"
        >
          <p className="text-sm text-[var(--muted)]">Orders</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{ordersCount}</p>
        </Link>
        {(session.user as { role?: string })?.role === "SELLER" && (
          <Link
            href="/dashboard/listings"
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--gold)]/50 transition"
          >
            <p className="text-sm text-[var(--muted)]">Active listings</p>
            <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{listingsCount}</p>
          </Link>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Quick links</h2>
        <ul className="space-y-2">
          <li><Link href="/listings" className="text-[var(--gold)] hover:underline">Browse marketplace</Link></li>
          <li><Link href="/dashboard/orders" className="text-[var(--gold)] hover:underline">My orders</Link></li>
          {(session.user as { role?: string })?.role === "SELLER" && (
            <li><Link href="/listings/create" className="text-[var(--gold)] hover:underline">Create listing</Link></li>
          )}
        </ul>
      </div>
    </div>
  );
}
