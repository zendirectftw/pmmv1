import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-utils"; // FIXED: Changed from requireAuth
import { prisma } from "@/lib/db";

const shipSchema = z.object({
  trackingNumber: z.string().min(1),
  carrier: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIXED: params is a Promise
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Check if user is logged in
    const user = await requireRole(["USER", "ADMIN"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { trackingNumber, carrier } = shipSchema.parse(json);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only the seller can mark as shipped
    if (order.sellerId !== (user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "SHIPPED",
        shippedAt: new Date(),
        trackingNumber,
        carrier,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
