"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ListingItem {
  id: string;
  title: string;
  metal: string;
  weightOz: number;
  priceUsd: number;
  premiumOverSpot: number | null;
  condition: string;
  images: string[];
  seller: { id: string; name: string | null };
  soldCount: number;
  createdAt: string;
}

interface ListingsResponse {
  items: ListingItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const METALS = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"] as const;
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
] as const;

export function ListingsClient() {
  const [data, setData] = useState<ListingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metal, setMetal] = useState<string>("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "12",
      sort,
    });
    if (metal) params.set("metal", metal);
    fetch(`/api/listings?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, metal, sort]);

  if (loading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] h-64 animate-pulse bg-[var(--border)]/30" />
        ))}
      </div>
    );
  }

  const list = data?.items ?? [];

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={metal}
          onChange={(e) => { setMetal(e.target.value); setPage(1); }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
        >
          <option value="">All metals</option>
          {METALS.map((m) => (
            <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="text-sm text-[var(--muted)]">
          {data?.total ?? 0} listing{data?.total !== 1 ? "s" : ""}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="text-[var(--muted)] py-12 text-center">No listings found.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item) => (
              <Link
                key={item.id}
                href={`/listings/${item.id}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--gold)]/50 transition"
              >
                <div className="aspect-[4/3] bg-[var(--border)]/30 flex items-center justify-center text-[var(--muted)]">
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{item.metal}</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[var(--gold)] font-medium uppercase tracking-wide">{item.metal}</p>
                  <h2 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition truncate">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    {item.weightOz} oz · {item.condition}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    ${item.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  {item.premiumOverSpot != null && (
                    <p className="text-xs text-[var(--muted)]">
                      {(item.premiumOverSpot * 100).toFixed(1)}% over spot
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-[var(--muted)]">
                Page {page} of {data.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
