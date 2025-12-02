import { Role, User } from "@/generated/prisma/client";
import { verifyUserToken } from "@/lib/helpers";
import { NextRequest } from "next/server";

export function authMiddleware(req: NextRequest): User {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Token manquant. Accès refusé.");
  }
  const { user } = verifyUserToken(token);
  if (!user) {
    throw new Error("Token invalide. Accès refusé.");
  }
  return user;
}

export async function adminAuthMiddleware(req: NextRequest): Promise<User> {
  const user = authMiddleware(req);
  if (user.role !== Role.ADMIN) {
    throw new Error("Accès refusé. Rôle administrateur requis.");
  }
  return user;
}
