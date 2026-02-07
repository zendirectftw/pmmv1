import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prices = await prisma.spotPrice.findMany({
      orderBy: { fetchedAt: "desc" },
    });

    const byMetal = Object.fromEntries(
      // FIXED: Added ': any' to the parameter 'p'
      prices.map((p: any) => [
        p.metal, 
        { priceUsd: Number(p.priceUsd), fetchedAt: p.fetchedAt }
      ])
    );

    return NextResponse.json(byMetal);
  } catch (error) {
    console.error("Spot prices fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch current prices" }, { status: 500 });
  }
}
