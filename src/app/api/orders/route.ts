import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PLATFORM_FEE_PERCENT = 2; // 2% platform fee

export async function GET() {
  try {
    const session = await requireAuth();
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
      },
      include: {
        listing: { select: { id: true, title: true, metal: true, weightOz: true, images: true } },
        seller: { select: { id: true, name: true } },
        buyer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const serialized = orders.map((o) => ({
      id: o.id,
      listing: o.listing,
      quantity: o.quantity,
      totalAmountCents: o.totalAmountCents,
      status: o.status,
      trackingNumber: o.trackingNumber,
      shippedAt: o.shippedAt,
      createdAt: o.createdAt,
      role: o.buyerId === session.user.id ? "buyer" : "seller",
      otherParty: o.buyerId === session.user.id ? o.seller : o.buyer,
    }));
    return NextResponse.json(serialized);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { listingId, quantity = 1 } = body;
    if (!listingId || quantity < 1) {
      return NextResponse.json({ error: "listingId and quantity required" }, { status: 400 });
    }
    const listing = await prisma.listing.findUnique({
      where: { id: listingId, status: "ACTIVE" },
      include: { seller: true },
    });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (listing.sellerId === session.user.id) {
      return NextResponse.json({ error: "Cannot buy your own listing" }, { status: 400 });
    }
    const totalCents = Math.round(Number(listing.priceUsd) * 100 * quantity);
    const platformFeeCents = Math.round((totalCents * PLATFORM_FEE_PERCENT) / 100);
    const order = await prisma.order.create({
      data: {
        buyerId: session.user.id,
        sellerId: listing.sellerId,
        listingId: listing.id,
        quantity,
        totalAmountCents: totalCents,
        platformFeeCents,
        status: "PENDING_PAYMENT",
      },
    });
    if (!stripe) {
      return NextResponse.json({
        orderId: order.id,
        clientSecret: null,
        message: "Stripe not configured. Set STRIPE_SECRET_KEY. Order created for testing.",
      });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents + platformFeeCents,
      currency: "usd",
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });
    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      amount: totalCents + platformFeeCents,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("Create order error:", e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
