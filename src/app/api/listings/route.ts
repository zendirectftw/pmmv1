import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Removed the strict imports from @prisma/client to fix the build error

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  metal: z.string().optional(), // Changed from MetalType to string
  condition: z.string().optional(), // Changed from ListingCondition to string
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));
    
    const skip = (params.page - 1) * params.limit;

    const where: any = {
      status: "ACTIVE",
    };

    if (params.metal) where.metal = params.metal;
    if (params.condition) where.condition = params.condition;
    if (params.category) where.category = params.category;
    
    if (params.minPrice || params.maxPrice) {
      where.priceUsd = {};
      if (params.minPrice) where.priceUsd.gte = params.minPrice;
      if (params.maxPrice) where.priceUsd.lte = params.maxPrice;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        total,
        pages: Math.ceil(total / params.limit),
        currentPage: params.page,
        limit: params.limit,
      },
    });
  } catch (error) {
    console.error("Listings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}
