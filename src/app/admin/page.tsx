import { prisma } from "@/lib/db";
// We use a generic import if we aren't sure of the exact export name, 
// but based on your previous errors, let's try this standard approach:
import { getServerSession } from "next-auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) {
    return <div>Access Denied</div>;
  }

  const [userCount, listingCount, orderCount] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.order.count(),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--muted)]">Users</p>
          <p className="text-2xl font-bold">{userCount}</p>
        </div>
        <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--muted)]">Active Listings</p>
          <p className="text-2xl font-bold">{listingCount}</p>
        </div>
        <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--muted)]">Total Orders</p>
          <p className="text-2xl font-bold">{orderCount}</p>
        </div>
      </div>
    </div>
  );
}