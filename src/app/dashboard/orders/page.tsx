import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function UserOrdersPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { buyer: { email: session.user.email } },
        { seller: { email: session.user.email } },
      ],
    },
    include: {
      listing: true,
      seller: true,
      buyer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Loop 1 Fixed
  const serialized = orders.map((o: any) => ({
    id: o.id,
    listing: {
      ...o.listing,
      priceUsd: Number(o.listing.priceUsd),
    },
    status: o.status,
    createdAt: o.createdAt,
    isBuyer: o.buyer.email === session.user?.email,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      
      {serialized.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-2xl">
          <p className="text-[var(--muted)]">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Loop 2 Fixed: Added : any here */}
          {serialized.map((order: any) => (
            <div key={order.id} className="p-4 border rounded-xl bg-[var(--card)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                  <Image 
                    src={order.listing.images?.[0] || "/placeholder.png"} 
                    alt="Listing" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <p className="font-medium">{order.listing.title}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {order.isBuyer ? "Purchased from" : "Sold to"} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.listing.priceUsd.toLocaleString()}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)]/10">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
