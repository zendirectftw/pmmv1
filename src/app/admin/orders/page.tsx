import { prisma } from "@/lib/db";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      listing: { select: { title: true } },
      buyer: { select: { email: true } },
      seller: { select: { email: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Orders</h1>
      <p className="text-[var(--muted)] mt-1">Transaction monitoring</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="text-left p-3 font-medium">ID</th>
              <th className="text-left p-3 font-medium">Listing</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Buyer</th>
              <th className="text-left p-3 font-medium">Seller</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[var(--border)]">
                <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td className="p-3 truncate max-w-[150px]">{o.listing.title}</td>
                <td className="p-3">${(o.totalAmountCents / 100).toFixed(2)}</td>
                <td className="p-3">{o.buyer.email}</td>
                <td className="p-3">{o.seller.email}</td>
                <td className="p-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
