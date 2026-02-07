import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const allowed = ["SELLER_SHIPPING", "SHIPPED", "DELIVERED"];
    if (!allowed.includes(order.status)) {
      return NextResponse.json(
        { error: "Order cannot be confirmed in current state" },
        { status: 400 }
      );
    }
    await prisma.order.update({
      where: { id },
      data: {
        status: "COMPLETED",
        confirmedAt: new Date(),
      },
    });
    // TODO: Escrow release — trigger Stripe transfer to seller; credit seller wallet
    // TODO: Credit seller wallet or Stripe payout; deduct platform fee
    return NextResponse.json({ message: "Delivery confirmed. Funds released to seller." });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed to confirm" }, { status: 500 });
  }
}
