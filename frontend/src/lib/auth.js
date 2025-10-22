export const getDefaultRouteByRole = (role) => {
  switch (role) {
    case "superadmin":
    case "admin":
      return "/dashboard";       // super-admin pages
    case "church-admin":
      return "/church-dash";     // church admin pages
    case "member":
    default:
      return "/memberdash";      // member pages
  }
};
