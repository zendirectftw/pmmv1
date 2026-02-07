import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex mx-auto w-full max-w-7xl px-4">
        <aside className="w-48 py-8 pr-8 border-r border-[var(--border)] flex-shrink-0">
          <nav className="space-y-1">
            <Link href="/admin" className="block text-sm text-[var(--foreground)] hover:text-[var(--gold)]">Overview</Link>
            <Link href="/admin/users" className="block text-sm text-[var(--foreground)] hover:text-[var(--gold)]">Users</Link>
            <Link href="/admin/listings" className="block text-sm text-[var(--foreground)] hover:text-[var(--gold)]">Listings</Link>
            <Link href="/admin/orders" className="block text-sm text-[var(--foreground)] hover:text-[var(--gold)]">Orders</Link>
            <Link href="/admin/disputes" className="block text-sm text-[var(--foreground)] hover:text-[var(--gold)]">Disputes</Link>
          </nav>
        </aside>
        <main className="flex-1 py-8 pl-8">{children}</main>
      </div>
    </div>
  );
}
