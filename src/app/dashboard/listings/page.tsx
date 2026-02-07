import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserListingsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const listings = await prisma.listing.findMany({
    where: {
      seller: { email: session.user.email },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Link 
          href="/dashboard/listings/new" 
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm"
        >
          Create New
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-12 text-center p-8 border border-dashed rounded-2xl">
          <p className="text-[var(--muted)]">You haven't posted any listings yet.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {listings.map((l: any) => (
            <li
              key={l.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)]">
                <Image
                  src={l.images[0] || "/placeholder.png"}
                  alt={l.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{l.title}</h3>
                <p className="text-sm text-[var(--muted)]">${Number(l.priceUsd).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${l.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-[var(--muted)]/10 text-[var(--muted)]'}`}>
                  {l.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
