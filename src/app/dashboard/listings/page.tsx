import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardListingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string })?.role;
  if (!userId) redirect("/auth/signin");
  if (role !== "SELLER" && role !== "ADMIN") redirect("/dashboard");

  const listings = await prisma.listing.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">My listings</h1>
        <Link
          href="/listings/create"
          className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New listing
        </Link>
      </div>
      <p className="text-[var(--muted)] mt-1">Manage your marketplace listings</p>
      {listings.length === 0 ? (
        <p className="text-[var(--muted)] py-12">
          No listings yet. <Link href="/listings/create" className="text-[var(--gold)] hover:underline">Create one</Link>
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {listings.map((l) => (
            <li
              key={l.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg bg-[var(--border)]/30 flex-shrink-0 overflow-hidden">
                {l.images[0] ? (
                  <img src={l.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-[var(--muted)] text-sm">{l.metal}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--foreground)]">{l.title}</p>
                <p className="text-sm text-[var(--muted)]">{l.metal} · {Number(l.weightOz)} oz · {l.status}</p>
              </div>
              <p className="font-semibold text-[var(--foreground)]">${Number(l.priceUsd).toFixed(2)}</p>
              <Link
                href={`/listings/${l.id}`}
                className="text-sm text-[var(--gold)] hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
