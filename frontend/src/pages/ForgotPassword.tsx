import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data.msg || "OTP sent to your email");

      // redirect to reset page with email
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        {msg && <p className="text-green-600 text-sm mb-3">{msg}</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSendOTP} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-blue-600 underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;