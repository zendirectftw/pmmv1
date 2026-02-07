"use client";

import Image from "next/image";
import PriceChart from "./PriceChart"; // Removed the brackets here

export default function ListingDetail({ listing, history }: any) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-square relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <Image
            src={listing.images[0] || "/placeholder.png"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-2xl font-semibold mt-2">${listing.priceUsd.toLocaleString()}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Price History</h3>
          <PriceChart data={history} />
        </div>

        <button className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
          Buy Now
        </button>
      </div>
    </div>
  );
}