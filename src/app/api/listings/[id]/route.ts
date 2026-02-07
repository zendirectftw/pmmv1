import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // FIXED: params is now a Promise
) {
  // We must await params before accessing properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: {
        include: {
          reviewsReceived: true,
        },
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const avgRating =
    listing.seller.reviewsReceived.length > 0
      ? listing.seller.reviewsReceived.reduce((a: number, r: any) => a + r.rating, 0) /
        listing.seller.reviewsReceived.length
      : null;

  const { reviewsReceived, ...seller } = listing.seller;

  return NextResponse.json({
    ...listing,
    seller: {
      ...seller,
      avgRating,
    },
  });
}
