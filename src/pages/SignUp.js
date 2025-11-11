import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  // 📧 Gửi OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!userData.email) return toast.error("Vui lòng nhập Email trước.");

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.sendOtpToSignUp.url, {
        method: SummaryApi.sendOtpToSignUp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      const result = await res.json();
      setLoading(false);

      if (result.success) {
        toast.success(result.message);
        setUserId(result.userId);
        setOtpSent(true);
      } else toast.error(result.message);
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi server khi gửi OTP.");
    }
  };

  // ✅ Hoàn tất đăng ký
  const handleFinalSignUp = async (e) => {
    e.preventDefault();
    if (!otpSent) return toast.error("Vui lòng gửi và nhập mã OTP.");
    if (otp.length !== 6) return toast.error("Mã OTP phải có 6 chữ số.");
    if (userData.password !== userData.confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp.");

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.finalSignUp.url, {
        method: SummaryApi.finalSignUp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, otp, userId }),
      });
      const result = await res.json();
      setLoading(false);

      if (result.success) {
        toast.success("Đăng ký thành công! Đang chuyển hướng...");
        navigate("/");
      } else toast.error(result.message);
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi server, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Đăng Ký Tài Khoản
        </h2>

        <form onSubmit={handleFinalSignUp} className="space-y-5">
          {/* Họ và tên */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Họ và tên
            </label>
            <input
              name="name"
              placeholder="Nhập họ và tên"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Email + Gửi OTP */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email
            </label>
            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={userData.email}
                onChange={handleChange}
                className="w-full flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
                disabled={otpSent}
              />
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || otpSent || !userData.email}
                className="px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all"
              >
                {loading ? "Đang gửi..." : otpSent ? "Đã gửi" : "Gửi OTP"}
              </button>
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              placeholder="Ít nhất 12 ký tự, gồm HOA, thường, số, ký tự đặc biệt"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Nhập OTP */}
          {otpSent && (
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Mã OTP
              </label>
              <input
                name="otp"
                placeholder="Nhập mã OTP gồm 6 chữ số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !otpSent}
            className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition-all shadow-md"
          >
            {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-sm">
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Đăng nhập ngay
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
