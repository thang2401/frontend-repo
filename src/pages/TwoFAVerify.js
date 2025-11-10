import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

const TwoFAVerify = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Mã OTP phải có 6 chữ số.");
      return;
    }

    const response = await fetch(SummaryApi.twoFA_verify.url, {
      method: SummaryApi.twoFA_verify.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: otp }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Xác thực 2FA thành công! Đang chuyển hướng...");
      // Sau khi verify thành công, backend cần trả về một token mới có cờ twoFA: true
      // Ta gọi lại API current_user để nhận token mới và cập nhật trạng thái người dùng
      // (Giả sử logic cập nhật user details có sẵn trong App.js)
      setTimeout(() => {
        window.location.href = "/admin-panel"; // Reload để đảm bảo token mới được sử dụng
      }, 1000);
    } else {
      toast.error(data.message || "Xác minh OTP thất bại.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Xác Thực 2FA Bắt Buộc
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Vui lòng nhập Mã Xác Thực (OTP) từ ứng dụng Google Authenticator của
          bạn để tiếp tục truy cập Admin Panel.
        </p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4 text-center text-lg tracking-widest"
            placeholder="— — — — — —"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Xác Thực
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFAVerify;
