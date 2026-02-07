import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await prisma.spotPrice.findMany({
      orderBy: { fetchedAt: "desc" },
      take: 30,
    });

    // FIXED: Added ': any' to the parameter 'r'
    const data = rows.map((r: any) => ({
      date: r.fetchedAt.toISOString().slice(0, 10),
      price: Number(r.priceUsd),
    }));

    // Reverse so the chart goes from oldest to newest
    return NextResponse.json(data.reverse());
  } catch (error) {
    console.error("Price history error:", error);
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 });
  }
}
