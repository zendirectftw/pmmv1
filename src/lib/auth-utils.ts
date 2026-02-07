import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Removed strict Role import from @prisma/client to fix the build error

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireRole(allowedRoles: string[]) {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  // Use 'any' here to bypass the strict property check on the session user
  const user = (session.user as any);

  if (!user.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  return user;
}
