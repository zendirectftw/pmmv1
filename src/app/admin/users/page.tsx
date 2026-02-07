import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Users</h1>
      <p className="text-[var(--muted)] mt-1">User management</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--border)]">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 text-[var(--muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
