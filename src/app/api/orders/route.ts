import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [{ buyerId: user.id }, { sellerId: user.id }],
      },
      include: {
        listing: true,
        otherParty: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // FIXED: Added ': any' to the map function to satisfy TypeScript
    const serialized = orders.map((o: any) => ({
      id: o.id,
      listing: o.listing,
      quantity: o.quantity,
      totalAmountCents: o.totalAmountCents,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      shippedAt: o.shippedAt?.toISOString() || null,
      deliveredAt: o.deliveredAt?.toISOString() || null,
      buyerId: o.buyerId,
      sellerId: o.sellerId,
      otherParty: o.otherParty,
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
