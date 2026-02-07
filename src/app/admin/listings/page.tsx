import { prisma } from "@/lib/db";
import ListingDetail from "@/components/marketplace/ListingDetail";

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    include: {
      seller: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Listings</h1>
      <div className="grid gap-6">
        {listings.map((listing: any) => {
          // Fix: Ensure priceUsd is treated as a number for the chart
          const price = Number(listing.priceUsd);
          const history = [
            { time: "Mon", price: price * 0.95 },
            { time: "Wed", price: price * 0.98 },
            { time: "Fri", price: price },
          ];

          return (
            <div key={listing.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)]">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    Seller: {listing.seller?.name || listing.seller?.email || 'Unknown'}
                  </p>
                </div>
                <p className="font-bold text-lg">${price.toLocaleString()}</p>
              </div>
              <ListingDetail listing={listing} history={history} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
