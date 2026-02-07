import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export default async function WalletPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/auth/signin");

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const available = wallet ? wallet.balanceCents / 100 : 0;
  const pending = wallet ? wallet.pendingCents / 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Wallet</h1>
      <p className="text-[var(--muted)] mt-1">Your balance and pending funds</p>
      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 max-w-md">
        <p className="text-sm text-[var(--muted)]">Available</p>
        <p className="text-3xl font-semibold text-[var(--foreground)] mt-1">${available.toFixed(2)}</p>
        <p className="text-sm text-[var(--muted)] mt-4">Pending (in escrow)</p>
        <p className="text-xl font-medium text-[var(--foreground)]">${pending.toFixed(2)}</p>
        <p className="text-xs text-[var(--muted)] mt-6">
          Completed sales are credited here. Withdrawals can be enabled via Stripe Connect (TODO).
        </p>
      </div>
    </div>
  );
}
