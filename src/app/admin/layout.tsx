import { requireRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We check if the user has the ADMIN role
  const user = await requireRole(["ADMIN"]);

  // If they aren't an admin (or aren't logged in), kick them to the sign-in page
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex flex-col md:flex-row">
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
