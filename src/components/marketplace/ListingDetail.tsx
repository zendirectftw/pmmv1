"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PriceChart } from "./PriceChart";

interface ListingDetailProps {
  listing: {
    id: string;
    title: string;
    description: string;
    metal: string;
    weightOz: number;
    priceUsd: number;
    premiumOverSpot: number | null;
    condition: string;
    images: string[];
    seller: {
      id: string;
      name: string | null;
      image: string | null;
      averageRating: number | null;
      reviewCount: number;
    };
    createdAt: string;
  };
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const { data: session, status } = useSession();
  const [spotPrice, setSpotPrice] = useState<number | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    fetch("/api/spot-prices")
      .then((r) => r.json())
      .then((data) => setSpotPrice(data[listing.metal]?.priceUsd ?? null))
      .catch(() => {});
  }, [listing.metal]);

  const spotValue = spotPrice != null ? spotPrice * listing.weightOz : null;
  const premiumPercent =
    spotValue != null && spotValue > 0
      ? (((listing.priceUsd - spotValue) / spotValue) * 100).toFixed(1)
      : listing.premiumOverSpot != null
        ? (Number(listing.premiumOverSpot) * 100).toFixed(1)
        : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--border)]/20 aspect-square max-w-lg">
          {listing.images[imgIndex] ? (
            <img
              src={listing.images[imgIndex]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[var(--muted)] text-lg">
              {listing.metal}
            </div>
          )}
        </div>
        {listing.images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {listing.images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIndex(i)}
                className={`rounded-lg border w-16 h-16 overflow-hidden flex-shrink-0 ${
                  i === imgIndex ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/30" : "border-[var(--border)]"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--gold)] uppercase tracking-wide">{listing.metal}</p>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mt-1">{listing.title}</h1>
        <p className="text-[var(--muted)] mt-1">
          {listing.weightOz} oz · {listing.condition}
        </p>
        <p className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
          ${listing.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        {spotPrice != null && (
          <p className="text-sm text-[var(--muted)] mt-1">
            Spot: ${spotPrice.toFixed(2)}/oz · {premiumPercent != null && `~${premiumPercent}% over spot`}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm font-medium text-[var(--foreground)]">Seller</p>
          <div className="flex items-center gap-3 mt-2">
            {listing.seller.image ? (
              <img
                src={listing.seller.image}
                alt=""
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--muted)]">
                {(listing.seller.name ?? "S")[0]}
              </div>
            )}
            <div>
              <p className="font-medium text-[var(--foreground)]">
                {listing.seller.name ?? "Seller"}
              </p>
              {listing.seller.averageRating != null && (
                <p className="text-sm text-[var(--muted)]">
                  ★ {listing.seller.averageRating.toFixed(1)} ({listing.seller.reviewCount} reviews)
                </p>
              )}
            </div>
          </div>
        </div>

        {status === "authenticated" && (session?.user as { id?: string })?.id !== listing.seller.id && (
          <Link
            href={`/checkout?listingId=${listing.id}`}
            className="mt-6 inline-block rounded-lg bg-[var(--gold)] px-6 py-3 font-medium text-white hover:opacity-90 transition"
          >
            Buy now
          </Link>
        )}
        {status !== "authenticated" && (
          <Link
            href={`/auth/signin?callbackUrl=/listings/${listing.id}`}
            className="mt-6 inline-block rounded-lg bg-[var(--gold)] px-6 py-3 font-medium text-white hover:opacity-90 transition"
          >
            Sign in to buy
          </Link>
        )}

        <div className="mt-8 prose prose-sm max-w-none text-[var(--foreground)]">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-[var(--muted)] whitespace-pre-wrap">{listing.description}</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Price history (spot)</h2>
        <PriceChart metal={listing.metal} />
      </div>
    </div>
  );
}
