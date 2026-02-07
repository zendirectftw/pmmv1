import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { orderId, reason } = parsed.data;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const isBuyer = order.buyerId === session.user.id;
    const isSeller = order.sellerId === session.user.id;
    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const existing = await prisma.dispute.findUnique({ where: { orderId } });
    if (existing) return NextResponse.json({ error: "Dispute already exists" }, { status: 409 });
    await prisma.dispute.create({
      data: {
        orderId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        reason,
      },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "DISPUTED" },
    });
    return NextResponse.json({ message: "Dispute opened" });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed to open dispute" }, { status: 500 });
  }
}
