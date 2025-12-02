import { NextRequest } from "next/server";
import { redirectToDashboard, redirectToLogin } from "./guards/auth.guard";

export async function proxy(request: NextRequest) {
  // const signInRedirect = await redirectToLogin(request);
  // if (signInRedirect) {
  //   return signInRedirect;
  // }
  // const dashboardRedirect = await redirectToDashboard(request);
  // if (dashboardRedirect) {
  //   return dashboardRedirect;
  // }
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|.well-known/workflow/).*)",
  ],
};
