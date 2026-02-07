import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Returns historical spot prices for chart. In production, backfill from metals API.
export async function GET(req: NextRequest) {
  const metal = req.nextUrl.searchParams.get("metal");
  if (!metal || !["GOLD", "SILVER", "PLATINUM", "PALLADIUM"].includes(metal)) {
    return NextResponse.json([]);
  }
  const rows = await prisma.spotPrice.findMany({
    where: { metal: metal as "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM", currency: "USD" },
    orderBy: { fetchedAt: "asc" },
    take: 30,
  });
  const data = rows.map((r) => ({
    date: r.fetchedAt.toISOString().slice(0, 10),
    price: Number(r.priceUsd),
  }));
  return NextResponse.json(data);
}
