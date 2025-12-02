export const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    resetPassword: "/auth/reset-password",
    resendVerificationCode: "/auth/resend-verification-code",
  },
  app: {
    home: "/",
    contact: "/contact",
    about: "/about",
    dashboard: {
      overview: "/dashboard/overview",
    },
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
  },
};

export const publicRoutes = [
  routes.auth.login,
  routes.auth.register,
  routes.auth.resetPassword,
  routes.auth.resendVerificationCode,
  routes.app.home,
  routes.app.contact,
  routes.app.about,
];

export const adminRoutes = [routes.admin.dashboard, routes.admin.users];

export const userRoutes = [routes.app.dashboard.overview];

export const protectedRoutes = [...adminRoutes, ...userRoutes];
