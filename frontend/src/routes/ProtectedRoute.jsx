import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ roles, element }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
