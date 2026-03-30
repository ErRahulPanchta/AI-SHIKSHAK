import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await login(data);

      if (res.success) {
        toast.success("Welcome back ");
        navigate("/");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600 px-4">

      <div className="bg-white/90 backdrop-blur-lg w-full max-w-md p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-3 outline-none bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              className="w-full p-3 outline-none bg-transparent"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Navigation */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;