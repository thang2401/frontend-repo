import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(""); // Lưu userId từ Backend
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(SummaryApi.signUp.url, {
        method: SummaryApi.signUp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const result = await res.json();
      setLoading(false);

      if (result.success) {
        toast.success(result.message);
        // Lấy userId để chuyển sang bước xác thực OTP
        setUserId(result.userId || result.data._id);
        setStep(2); // Chuyển sang bước 2
      } else toast.error(result.message);
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi server, vui lòng thử lại");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(SummaryApi.verifyOTP.url, {
        // Đảm bảo SummaryApi.verifyOTP trỏ đến POST /api/verify-otp
        method: SummaryApi.verifyOTP.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const result = await res.json();

      setLoading(false);

      if (result.success) {
        toast.success(result.message);
        // Chuyển hướng đến trang đăng nhập sau khi xác thực thành công
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi server, vui lòng thử lại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      {/* BƯỚC 1: ĐĂNG KÝ */}
      {step === 1 && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-4">
            Đăng Ký Tài Khoản
          </h2>
          <input
            name="name"
            placeholder="Họ và tên"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          {/* Email và Password inputs */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Đang gửi mã..." : "Đăng ký"}
          </button>
        </form>
      )}

      {/* BƯỚC 2: XÁC THỰC OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-4">Xác Thực OTP</h2>
          <p className="text-sm text-gray-600 text-center">
            Mã OTP đã gửi đến **{userData.email}**. Vui lòng kiểm tra email.
          </p>

          <input
            placeholder="Mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-center text-lg tracking-widest"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Đang xác thực..." : "Xác thực OTP"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
