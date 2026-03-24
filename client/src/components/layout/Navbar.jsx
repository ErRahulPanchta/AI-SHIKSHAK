import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        AI SHIKSHAK
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">

        <Link to="/blogs" className="hover:text-blue-500">
          Blogs
        </Link>

        {isAuthenticated ? (
          <>
            {/* User Name */}
            <span className="text-gray-700 font-medium">
              {user?.name}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;