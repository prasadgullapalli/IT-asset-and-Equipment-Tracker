import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);

  // ⏱ Timer logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔁 Resend OTP
  const handleResendOTP = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("OTP resent successfully");
      setTimer(30); // reset timer
    } catch (err: any) {
      setError("Failed to resend OTP");
    }
  };

  // 🔐 Reset Password
  const handleReset = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });

      setMsg(res.data.msg || "Password reset successful");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {msg && <p className="text-green-600 text-sm mb-3">{msg}</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleReset} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* OTP */}
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {/* Password with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-3 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* 🔁 Resend OTP */}
        <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-blue-600 text-sm underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;