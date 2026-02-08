import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-utils"; // FIXED: Name change
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIXED: Promise type
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Check if user is logged in
    const user = await requireRole(["USER", "ADMIN"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only the buyer can confirm receipt
    if (order.buyerId !== (user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Order confirmation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
