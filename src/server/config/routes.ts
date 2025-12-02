export const routes = {
  auth: {
    login: "/login",
    signup: "/signup",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  app: {
    home: "/",
    invoices: {
      new: "/invoices/new",
      detail: (id: string) => `/invoices/${id}`,
      edit: (id: string) => `/invoices/${id}/edit`,
    },
    settings: {
      profile: "/settings/profile",
      business: "/settings/business",
    },
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
  },
};

export const publicRoutes = [
  routes.auth.login,
  routes.auth.signup,
  routes.auth.verifyEmail,
  routes.auth.forgotPassword,
  routes.auth.resetPassword,
  routes.app.home,
];

export const authRoutes = [
  routes.auth.login,
  routes.auth.signup,
  routes.auth.verifyEmail,
  routes.auth.forgotPassword,
  routes.auth.resetPassword,
];

export const adminRoutes = [routes.admin.dashboard, routes.admin.users];

export const userRoutes = [
  routes.app.home,
  routes.app.invoices.new,
  routes.app.settings.profile,
  routes.app.settings.business,
];

export const protectedRoutes = [...adminRoutes, ...userRoutes];
