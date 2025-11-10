import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Đã gửi OTP thành công
  const [userId, setUserId] = useState(""); // userId tạm thời
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  // 📧 HÀM CHỈ GỬI OTP (API: /api/send-otp-to-signup)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!userData.email) return toast.error("Vui lòng nhập Email trước.");

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.sendOtpToSignUp.url, {
        method: SummaryApi.sendOtpToSignUp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }), // CHỈ GỬI EMAIL
      });
      const result = await res.json();
      setLoading(false);

      if (result.success) {
        toast.success(result.message);
        setUserId(result.userId);
        setOtpSent(true); // Mở ô nhập OTP
      } else toast.error(result.message);
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi server khi gửi OTP.");
    }
  };

  // ✅ HÀM XỬ LÝ SUBMIT TOÀN BỘ FORM (API: /api/final-signup)
  const handleFinalSignUp = async (e) => {
    e.preventDefault();
    if (!otpSent) return toast.error("Vui lòng gửi và nhập mã OTP.");
    if (otp.length !== 6) return toast.error("Mã OTP phải có 6 chữ số.");

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.finalSignUp.url, {
        method: SummaryApi.finalSignUp.method,
        headers: { "Content-Type": "application/json" },
        // Gửi toàn bộ dữ liệu + userId tạm thời
        body: JSON.stringify({ ...userData, otp, userId }),
      });
      const result = await res.json();
      setLoading(false);

      if (result.success) {
        toast.success("Đăng ký thành công! Đang tự động đăng nhập...");
        // Tài khoản đã được tạo và token đã được lưu (Backend làm)
        navigate("/"); // Chuyển về trang chủ hoặc dashboard
      } else toast.error(result.message);
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi server, vui lòng thử lại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Đăng Ký Tài Khoản</h2>

      <form onSubmit={handleFinalSignUp} className="space-y-4">
        {/* Input Tên */}
        <input
          name="name"
          placeholder="Họ và tên"
          value={userData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        {/* Input Mật khẩu */}
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu (ít nhất 12 ký tự, HOA, thường, số, ký tự đặc biệt)"
          value={userData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Input Email và Nút GỬI OTP */}
        <div className="flex gap-2">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full flex-grow p-2 border border-gray-300 rounded"
            required
            disabled={otpSent}
          />
          <button
            type="button" // Quan trọng: type="button" để không submit form
            onClick={handleSendOTP}
            disabled={loading || otpSent || !userData.email}
            className="p-2 whitespace-nowrap bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 text-sm"
          >
            {loading ? "Đang gửi..." : otpSent ? "Đã gửi" : "Gửi OTP"}
          </button>
        </div>

        {/* Ô NHẬP OTP (Chỉ hiện khi đã gửi mã) */}
        {otpSent && (
          <input
            name="otp"
            placeholder="Mã OTP (6 chữ số)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-center text-lg tracking-widest"
            required
          />
        )}

        {/* Nút SUBMIT CUỐI CÙNG */}
        <button
          type="submit"
          disabled={loading || !otpSent} // Chỉ cho submit khi đã nhận OTP
          className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? "Đang hoàn tất..." : "Hoàn tất Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
