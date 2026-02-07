import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ListingDetail } from "@/components/marketplace/ListingDetail";

async function getListing(id: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/listings/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
        <ListingDetail listing={listing} />
      </main>
    </div>
  );
}
