import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import type { MetalType, ListingCondition } from "@prisma/client";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(12),
  metal: z.enum(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]).optional(),
  condition: z.enum(["NEW", "MINT", "EXCELLENT", "GOOD", "FAIR"]).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
});

export async function GET(req: NextRequest) {
  const sp = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = querySchema.safeParse(sp);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const { page, pageSize, metal, condition, sort } = parsed.data;
  const skip = (page - 1) * pageSize;

  const where = {
    status: "ACTIVE",
    ...(metal && { metal: metal as MetalType }),
    ...(condition && { condition: condition as ListingCondition }),
  };

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        seller: { select: { id: true, name: true, image: true } },
        orders: { where: { status: "COMPLETED" }, select: { id: true } },
      },
      orderBy:
        sort === "price_asc"
          ? { priceUsd: "asc" }
          : sort === "price_desc"
            ? { priceUsd: "desc" }
            : { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  return NextResponse.json({
    items: items.map((l) => ({
      id: l.id,
      title: l.title,
      metal: l.metal,
      weightOz: Number(l.weightOz),
      priceUsd: Number(l.priceUsd),
      premiumOverSpot: l.premiumOverSpot != null ? Number(l.premiumOverSpot) : null,
      condition: l.condition,
      images: l.images,
      seller: l.seller,
      soldCount: l.orders.length,
      createdAt: l.createdAt,
    })),
    total,
    page,
    pageSize,
    totalPages,
  });
}
