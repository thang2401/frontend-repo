import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

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
        setUserId(result.userId);
        setStep(2);
      } else toast.error(result.message);
    } catch (err) {
      toast.error("Lỗi server, vui lòng thử lại");
    }
  };

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
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={userData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Đăng ký</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <p>Nhập OTP đã gửi đến email của bạn</p>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Xác thực OTP</button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
