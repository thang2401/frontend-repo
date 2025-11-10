import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: đăng ký, 2: OTP
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  // Bước 1: đăng ký
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setUserId(result.userId); // lưu userId để verify OTP
        setStep(2); // chuyển sang bước nhập OTP
      } else toast.error(result.message);
    } catch (err) {
      toast.error("Lỗi server, vui lòng thử lại");
      console.error(err);
    }
  };

  // Bước 2: xác thực OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(SummaryApi.verifyOTP.url, {
        method: SummaryApi.verifyOTP.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const result = await res.json();
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch (err) {
      toast.error("Lỗi server, vui lòng thử lại");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      {step === 1 && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            name="name"
            placeholder="Họ và tên"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Đăng ký
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <p>Nhập OTP đã gửi đến email của bạn</p>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Xác thực OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
