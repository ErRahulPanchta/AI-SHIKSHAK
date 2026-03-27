import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const RoleGuard = ({ children, role }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) return <Navigate to="/" />;

  return children;
};

export default RoleGuard;