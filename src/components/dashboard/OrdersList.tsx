"use client";

// We use 'any' here to bypass the Date-to-String serialization error during build
export function OrdersList({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-xl">
        <p className="text-[var(--muted)]">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{order.listing?.title || "Unknown Listing"}</p>
            <p className="text-sm text-[var(--muted)]">Status: {order.status}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${(order.totalAmountCents / 100).toFixed(2)}</p>
            <p className="text-xs text-[var(--muted)]">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}