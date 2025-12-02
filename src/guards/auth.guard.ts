import {
  adminRoutes,
  protectedRoutes,
  routes,
  userRoutes,
} from "@/server/config/routes";
import { Role } from "@/server/modules/user/user.model";
import { getSession, removeSession } from "@/services/session.service";
import { NextRequest, NextResponse } from "next/server";

export async function redirectToLogin(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await getSession();
  if (!session.isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(routes.auth.login, req.url));
  }
}

export async function redirectToDashboard(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await getSession();
  const user = session.data;
  switch (user.role) {
    case Role.ADMIN:
      if (!adminRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(routes.admin.dashboard, req.url));
      } else {
        return;
      }
    case Role.USER:
      if (userRoutes.includes(pathname)) {
        return NextResponse.redirect(
          new URL(routes.app.dashboard.overview, req.url),
        );
      } else {
        return;
      }
    default:
      removeSession();
      return NextResponse.redirect(new URL(routes.auth.login, req.url));
  }
}
