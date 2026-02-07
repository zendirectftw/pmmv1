"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";

const METALS = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"] as const;
const CONDITIONS = ["NEW", "MINT", "EXCELLENT", "GOOD", "FAIR"] as const;

export default function CreateListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metal, setMetal] = useState<(typeof METALS)[number]>("GOLD");
  const [weightOz, setWeightOz] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [premiumOverSpot, setPremiumOverSpot] = useState("");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("MINT");
  const [images, setImages] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const imageUrls = images.trim() ? images.split(/\s+/).filter(Boolean) : [];
    const res = await fetch("/api/listings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        metal,
        weightOz: parseFloat(weightOz) || 0,
        priceUsd: parseFloat(priceUsd) || 0,
        premiumOverSpot: premiumOverSpot ? parseFloat(premiumOverSpot) / 100 : undefined,
        condition,
        images: imageUrls,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(
          typeof data.error === "string"
            ? data.error
            : data.error?.title?.[0] ?? data.error?.description?.[0] ?? "Failed to create listing"
        );
      return;
    }
    router.push(`/listings/${data.id}`);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Create listing</h1>
        <p className="text-[var(--muted)] mt-1">Sell gold, silver, platinum, or palladium</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="text-red-600 text-sm rounded-md bg-red-50 dark:bg-red-950/30 p-2">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              placeholder="e.g. 1 oz American Gold Eagle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              placeholder="Condition, origin, any flaws..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Metal</label>
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value as (typeof METALS)[number])}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              >
                {METALS.map((m) => (
                  <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Weight (troy oz)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={weightOz}
                onChange={(e) => setWeightOz(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Premium over spot (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={premiumOverSpot}
                onChange={(e) => setPremiumOverSpot(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
                placeholder="e.g. 5"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as (typeof CONDITIONS)[number])}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Image URLs (one per line)</label>
            <textarea
              value={images}
              onChange={(e) => setImages(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--gold)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create listing"}
          </button>
        </form>
      </main>
    </div>
  );
}
