import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOtp, registerUser, requestOtp } from "../../services/auth.service";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state;

  useEffect(() => {
    if (!userData) navigate("/register");
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);

      await verifyOtp({
        email: userData.email,
        otp,
        type: "verify",
      });

      await registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestOtp({
        email: userData.email,
        type: "verify",
      });

      toast.success("OTP resent");
      setTimer(60);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="text-gray-500 mb-6">
          Enter the OTP sent to your email
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 rounded-lg text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-400"
          placeholder="------"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Register"}
        </button>

        <div className="mt-4 text-sm">
          {timer > 0 ? (
            <p>Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;