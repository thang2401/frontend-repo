import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { useSelector } from "react-redux";

const TwoFASetup = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);

  // State để lưu trữ dữ liệu 2FA
  const [setupData, setSetupData] = useState({
    qrCodeUrl: "",
    secret: "",
    otp: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Chỉ cho phép Admin truy cập trang này
  if (user?.role !== "ADMIN") {
    // Chuyển hướng nếu không phải admin (Biện pháp bảo mật cấp Client-side)
    toast.error("Bạn không có quyền truy cập trang thiết lập 2FA.");
    navigate("/admin-panel", { replace: true });
  }

  // --- LOGIC 1: TẠO MÃ QR CODE LẦN ĐẦU ---
  const handleGenerateSecret = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.twoFA_generate.url, {
        method: SummaryApi.twoFA_generate.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSetupData((prev) => ({
          ...prev,
          qrCodeUrl: data.qrCodeUrl,
          secret: data.secret,
        }));
        setIsGenerated(true);
        toast.success(
          "Mã QR đã được tạo. Vui lòng quét bằng ứng dụng xác thực."
        );
      } else {
        toast.error(data.message || "Không thể tạo mã bí mật.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi tạo mã.");
    }
    setIsLoading(false);
  };

  // --- LOGIC 2: XÁC MINH OTP LẦN ĐẦU & KÍCH HOẠT ---
  const handleVerifyAndActivate = async (e) => {
    e.preventDefault();
    if (setupData.otp.length !== 6 || !setupData.secret) {
      toast.error("Vui lòng nhập mã OTP 6 chữ số và tạo mã QR trước.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.twoFA_verify.url, {
        method: SummaryApi.twoFA_verify.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: setupData.otp }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Kích hoạt 2FA thành công! Đang chuyển hướng...");

        // 🛡️ BẢO MẬT: Chuyển hướng về trang chủ Admin và reload để nhận token mới có cờ 2FA=true
        setTimeout(() => {
          navigate("/admin-panel/all-products", { replace: true });
          window.location.reload(); // Đảm bảo App.js gọi lại fetchUserDetails với token mới
        }, 1000);
      } else {
        toast.error(data.message || "Mã OTP không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi xác minh.");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 py-8 min-h-[70vh] flex justify-center items-start">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600 border-b pb-2">
          🛡️ Thiết lập Xác thực 2FA (Bắt buộc cho Admin)
        </h1>

        {!isGenerated ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              Nhấn vào nút bên dưới để tạo Mã Bí mật. Bạn sẽ sử dụng mã này để
              thêm tài khoản vào ứng dụng xác thực (như Google Authenticator).
            </p>
            <button
              onClick={handleGenerateSecret}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? "Đang tạo..." : "Tạo Mã Bí mật và Mã QR"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyAndActivate} className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Bước 1: Quét Mã QR</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sử dụng ứng dụng Authenticator để quét mã bên dưới.
              </p>
              {setupData.qrCodeUrl && (
                <div className="flex justify-center p-4 border rounded-lg max-w-xs mx-auto">
                  <img
                    src={setupData.qrCodeUrl}
                    alt="QR Code 2FA"
                    className="w-full h-full"
                  />
                </div>
              )}
              <p className="mt-4 text-xs font-mono break-all bg-gray-100 p-2 rounded">
                Mã bí mật: **{setupData.secret}**
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Bước 2: Xác minh OTP
              </h3>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Mã OTP 6 chữ số:
              </label>
              <input
                id="otp"
                type="text"
                maxLength="6"
                value={setupData.otp}
                onChange={(e) =>
                  setSetupData({
                    ...setupData,
                    otp: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg text-lg tracking-widest text-center focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="— — — — — —"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || setupData.otp.length !== 6}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? "Đang xác minh..." : "Xác minh & Kích hoạt 2FA"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TwoFASetup;
