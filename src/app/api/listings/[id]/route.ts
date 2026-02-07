import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

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

  // FIXED: Explicitly typed 'a' and 'r' to bypass the build error
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
