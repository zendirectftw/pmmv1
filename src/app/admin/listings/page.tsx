import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { seller: { select: { email: true, name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Listings</h1>
      <p className="text-[var(--muted)] mt-1">Moderate marketplace listings</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Metal</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Seller</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-[var(--border)]">
                <td className="p-3">
                  <Link href={`/listings/${l.id}`} className="text-[var(--gold)] hover:underline truncate max-w-[200px] block">
                    {l.title}
                  </Link>
                </td>
                <td className="p-3">{l.metal}</td>
                <td className="p-3">${Number(l.priceUsd).toFixed(2)}</td>
                <td className="p-3">{l.seller.email}</td>
                <td className="p-3">{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
