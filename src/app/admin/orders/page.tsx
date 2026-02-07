import { prisma } from "@/lib/db";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      listing: {
        select: { title: true }
      },
      buyer: {
        select: { email: true }
      },
      seller: {
        select: { email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/5">
              <th className="p-3">ID</th>
              <th className="p-3">Listing</th>
              <th className="p-3">Buyer/Seller</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-[var(--border)]">
                <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td className="p-3 truncate max-w-[150px]">{o.listing?.title || "N/A"}</td>
                <td className="p-3 text-xs">
                  <div className="text-[var(--muted)]">B: {o.buyer?.email}</div>
                  <div className="text-[var(--muted)]">S: {o.seller?.email}</div>
                </td>
                <td className="p-3">${(o.totalAmountCents / 100).toFixed(2)}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)]/10">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
