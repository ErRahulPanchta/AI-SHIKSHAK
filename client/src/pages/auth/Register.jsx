import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service.js";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Registered successfully");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={data.name}
            className="border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={data.email}
            className="border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={data.password}
            className="border p-2 rounded"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={data.confirmPassword}
            className="border p-2 rounded"
          />

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create Account
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
