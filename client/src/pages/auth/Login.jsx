import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

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

    setLoading(true);

    const res = await login(data);

    if (res.success) {
      toast.success("Login successful");
      navigate("/");
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;