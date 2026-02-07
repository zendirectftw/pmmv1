import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Returns latest cached spot price per metal. In production, populate via cron from Metals API.
export async function GET() {
  const prices = await prisma.spotPrice.findMany({
    where: { currency: "USD" },
    orderBy: { fetchedAt: "desc" },
    distinct: ["metal"],
  });
  const byMetal = Object.fromEntries(
    prices.map((p) => [p.metal, { priceUsd: Number(p.priceUsd), fetchedAt: p.fetchedAt }])
  );
  return NextResponse.json(byMetal);
}
