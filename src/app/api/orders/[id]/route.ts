import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-utils"; // FIXED: Name change
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIXED: Promise type
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await requireRole(["USER", "ADMIN"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        listing: true,
        buyer: { select: { name: true, email: true } },
        seller: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security: Only buyer, seller, or admin can see the order details
    const userId = (user as any).id;
    if (order.buyerId !== userId && order.sellerId !== userId && (user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
