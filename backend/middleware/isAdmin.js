// backend/middleware/isAdmin.js
export default function isAdmin(req, res, next) {
  try {
    if (req.user?.role === "admin" || req.user?.role === "superadmin") return next();
    return res.status(403).json({ message: "Admins only." });
  } catch {
    return res.status(403).json({ message: "Admins only." });
  }
}
