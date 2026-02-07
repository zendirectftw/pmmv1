import { prisma } from "@/lib/db";

export default async function AdminDisputesPage() {
  // We fetch the disputes directly
  const disputes = await prisma.dispute.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Admin Disputes</h1>
      <p className="text-[var(--muted)] mt-1">Active platform cases</p>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Open Disputes ({disputes.length})</h2>
        
        {disputes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
            <p className="text-[var(--muted)]">No open disputes found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((item: any) => (
              <div 
                key={item.id} 
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      Dispute #{item.id.toString().slice(-6)}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      Status: <span className="text-orange-500">{item.status}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--muted)]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
