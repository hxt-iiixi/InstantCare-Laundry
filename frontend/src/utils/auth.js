// src/utils/auth.js
export const getDefaultRouteByRole = (role) => {
  switch (role) {
    case "superadmin":
      return "/dashboard";  // Superadmin page
    case "church-admin":
      return "/church-dash";  // Church-admin page
    case "admin":
      return "/dashboard";  // Admin page (or wherever the admin dashboard is)
    case "member":
    default:
      return "/memberdash";  // Member dashboard
  }
};
