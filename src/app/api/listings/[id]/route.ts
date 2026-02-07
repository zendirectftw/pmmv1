import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id, status: "ACTIVE" },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          reviewsReceived: { select: { rating: true } },
        },
      },
    },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  const avgRating =
    listing.seller.reviewsReceived.length > 0
      ? listing.seller.reviewsReceived.reduce((a, r) => a + r.rating, 0) /
        listing.seller.reviewsReceived.length
      : null;
  const { reviewsReceived, ...seller } = listing.seller;
  return NextResponse.json({
    ...listing,
    weightOz: Number(listing.weightOz),
    priceUsd: Number(listing.priceUsd),
    premiumOverSpot: listing.premiumOverSpot != null ? Number(listing.premiumOverSpot) : null,
    seller: { ...seller, averageRating: avgRating, reviewCount: reviewsReceived.length },
  });
}
