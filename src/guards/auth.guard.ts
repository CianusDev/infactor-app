import {
  adminRoutes,
  authRoutes,
  protectedRoutes,
  routes,
} from "@/server/config/routes";
import { Role } from "@/server/modules/user/user.model";
import { getSession, removeSession } from "@/services/session.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * et tente d'accéder à une route protégée
 */
export async function redirectToLogin(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await getSession();

  if (!session.isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(routes.auth.login, req.url));
  }
}

/**
 * Redirige vers le dashboard approprié si l'utilisateur est déjà authentifié
 * et tente d'accéder à une page d'authentification (login, signup, etc.)
 */
export async function redirectToDashboard(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await getSession();

  // Si l'utilisateur n'est pas authentifié, ne pas rediriger
  if (!session.isAuthenticated || !session.data) {
    return;
  }

  const user = session.data;

  // Si l'utilisateur est authentifié et accède à une page auth, rediriger vers le dashboard
  if (authRoutes.includes(pathname)) {
    switch (user.role) {
      case Role.ADMIN:
        return NextResponse.redirect(new URL(routes.admin.dashboard, req.url));
      case Role.USER:
        return NextResponse.redirect(new URL(routes.app.home, req.url));
      default:
        // Rôle inconnu, supprimer la session et laisser l'accès à la page auth
        await removeSession();
        return;
    }
  }

  // Vérifier les accès admin
  if (adminRoutes.includes(pathname) && user.role !== Role.ADMIN) {
    return NextResponse.redirect(new URL(routes.app.home, req.url));
  }
}
