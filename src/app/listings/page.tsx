import { Header } from "@/components/layout/Header";
import { ListingsClient } from "@/components/marketplace/ListingsClient";

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Marketplace</h1>
        <ListingsClient />
      </main>
    </div>
  );
}
