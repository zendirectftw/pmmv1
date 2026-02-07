import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priceUsd: z.number().positive(),
  weightOz: z.number().positive(),
  metal: z.string(),
  condition: z.string(),
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
        sellerId: (user as any).id,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // .flatten() is the safest way to get error messages in TypeScript
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error("Listing creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
