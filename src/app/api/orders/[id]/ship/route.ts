import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const shipSchema = z.object({
  trackingNumber: z.string().min(1),
  trackingCarrier: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (order.status !== "PAID_ESCROW") {
      return NextResponse.json(
        { error: "Order must be in PAID_ESCROW to ship" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const parsed = shipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "trackingNumber required" }, { status: 400 });
    }
    await prisma.order.update({
      where: { id },
      data: {
        trackingNumber: parsed.data.trackingNumber,
        trackingCarrier: parsed.data.trackingCarrier ?? null,
        status: "SELLER_SHIPPING",
        shippedAt: new Date(),
      },
    });
    // TODO: Notify buyer (email/push)
    return NextResponse.json({ message: "Shipment updated" });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 });
  }
}
