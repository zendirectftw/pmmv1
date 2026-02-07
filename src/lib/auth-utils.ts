import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Role } from "@prisma/client";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) throw new Response("Unauthorized", { status: 401 });
  return session;
}

export async function requireRole(allowed: Role[]) {
  const session = await requireAuth();
  if (!allowed.includes(session.user.role as Role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return session;
}

export function requireAdmin() {
  return requireRole(["ADMIN"]);
}
