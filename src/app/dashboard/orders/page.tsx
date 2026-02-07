import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { OrdersList } from "@/components/dashboard/OrdersList";

export default async function DashboardOrdersPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/auth/signin");

  const orders = await prisma.order.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    include: {
      listing: { select: { id: true, title: true, metal: true, weightOz: true, images: true, priceUsd: true } },
      seller: { select: { id: true, name: true } },
      buyer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map((o) => ({
    id: o.id,
    listing: {
      ...o.listing,
      priceUsd: Number(o.listing.priceUsd),
      weightOz: Number(o.listing.weightOz),
    },
    quantity: o.quantity,
    totalAmountCents: o.totalAmountCents,
    status: o.status,
    trackingNumber: o.trackingNumber,
    trackingCarrier: o.trackingCarrier,
    shippedAt: o.shippedAt,
    createdAt: o.createdAt,
    role: o.buyerId === userId ? "buyer" : "seller",
    otherParty: o.buyerId === userId ? o.seller : o.buyer,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Orders</h1>
      <p className="text-[var(--muted)] mt-1">View and manage your orders</p>
      <OrdersList orders={serialized} />
    </div>
  );
}
