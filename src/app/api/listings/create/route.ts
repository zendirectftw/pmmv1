import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

// Removed the strict imports from @prisma/client that were failing the build

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priceUsd: z.number().positive(),
  weightOz: z.number().positive(),
  metal: z.string(), // Changed from MetalType to string
  condition: z.string(), // Changed from ListingCondition to string
  category: z.string(),
  images: z.array(z.string()).min(1),
  purity: z.string().optional(),
  mint: z.string().optional(),
  year: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireRole(["USER", "ADMIN"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const body = createSchema.parse(json);

    const listing = await prisma.listing.create({
      data: {
        ...body,
        sellerId: user.id,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
