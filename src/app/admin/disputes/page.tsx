import { prisma } from "@/lib/db";

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    where: { status: "OPEN" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Disputes</h1>
      <div className="mt-6 space-y-4">
        {disputes.map((item: any) => (
          <div key={item.id} className="p-4 border rounded-xl bg-[var(--card)]">
            <p>ID: {item.id}</p>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}