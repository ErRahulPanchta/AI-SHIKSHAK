import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { requestOtp } from "../../services/auth.service";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.password) {
      return toast.error("All fields are required");
    }

    if (data.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await requestOtp({
        email: data.email,
        type: "verify",
      });

      toast.success("OTP sent 📩");

      navigate("/verify-otp", { state: data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-500 to-indigo-600 px-4">

      <div className="bg-white/90 backdrop-blur-lg w-full max-w-md p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-purple-500">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-3 outline-none bg-transparent"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-purple-500">
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
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-purple-500">
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

          {/* Confirm Password */}
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-purple-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={data.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 outline-none bg-transparent"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>

        {/* Navigation */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;