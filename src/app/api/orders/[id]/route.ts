import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        listing: true,
        seller: { select: { id: true, name: true, email: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.buyerId !== session.user.id && order.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const serialized = {
      ...order,
      listing: {
        ...order.listing,
        weightOz: Number(order.listing.weightOz),
        priceUsd: Number(order.listing.priceUsd),
      },
    };
    return NextResponse.json(serialized);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
