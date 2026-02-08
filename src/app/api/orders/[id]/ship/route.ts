import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const shipSchema = z.object({
  trackingNumber: z.string().min(1),
  carrier: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await requireRole(["USER", "ADMIN"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { trackingNumber, carrier } = shipSchema.parse(json);

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // FIXED: Swapped .errors for .flatten()
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
