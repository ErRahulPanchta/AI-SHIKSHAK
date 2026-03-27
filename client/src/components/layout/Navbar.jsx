import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          AI SHIKSHAK
        </Link>

        {/* 🔥 DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/blogs" className="hover:text-blue-500">
            Blogs
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/create-blog" className="hover:text-green-600">
                Write
              </Link>

              <Link to="/my-blogs" className="hover:text-purple-600">
                My Blogs
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-purple-600">
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* Name */}
              <span className="text-sm">{user?.name}</span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-blue-500">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* 🔥 MOBILE HAMBURGER */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 🔥 MOBILE MENU */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          <Link
            to="/blogs"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-500"
          >
            Blogs
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/create-blog"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-600"
              >
                Write
              </Link>

              <Link
                to="/my-blogs"
                onClick={() => setMenuOpen(false)}
                className="hover:text-purple-600"
              >
                My Blogs
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-gray-700">{user?.name}</span>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-red-500 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>

              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
