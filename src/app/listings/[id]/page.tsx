import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/marketplace/ListingDetail";

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        select: { name: true, image: true }
      }
    }
  });

  if (!listing) {
    notFound();
  }

  // Fix: Convert to number to prevent arithmetic errors
  const currentPrice = Number(listing.priceUsd);

  const history = [
    { time: "Mon", price: currentPrice * 0.95 },
    { time: "Wed", price: currentPrice * 0.98 },
    { time: "Fri", price: currentPrice },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ListingDetail listing={listing} history={history} />
    </div>
  );
}