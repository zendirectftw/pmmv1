import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-utils"; // FIXED: Name change
import { prisma } from "@/lib/db";

const createSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const user = await requireRole(["USER", "ADMIN"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { orderId, reason } = createSchema.parse(json);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only the buyer or seller can open a dispute
    const userId = (user as any).id;
    if (order.buyerId !== userId && order.sellerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dispute = await prisma.dispute.create({
      data: {
        orderId,
        reason,
        status: "OPEN",
        openedById: userId,
      },
    });

    return NextResponse.json(dispute);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Dispute creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
