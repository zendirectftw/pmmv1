import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import type { MetalType, ListingCondition } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  metal: z.enum(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]),
  weightOz: z.number().positive(),
  priceUsd: z.number().positive(),
  premiumOverSpot: z.number().min(0).max(2).optional(),
  condition: z.enum(["NEW", "MINT", "EXCELLENT", "GOOD", "FAIR"]),
  images: z.array(z.string().url()).max(10).default([]),
});

export async function POST(req: Request) {
  try {
    const session = await requireRole(["SELLER", "ADMIN"]);
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const listing = await prisma.listing.create({
      data: {
        sellerId: session.user.id,
        title: data.title,
        description: data.description,
        metal: data.metal as MetalType,
        weightOz: data.weightOz,
        priceUsd: data.priceUsd,
        premiumOverSpot: data.premiumOverSpot ?? null,
        condition: data.condition as ListingCondition,
        images: data.images,
      },
    });
    return NextResponse.json({ id: listing.id, message: "Listing created" });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("Create listing error:", e);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
