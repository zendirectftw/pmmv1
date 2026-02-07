import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/5">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                <td className="p-4">{user.name || "N/A"}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 text-sm text-[var(--muted)]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
