import React, { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const ResetPassword = () => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp");

    const res = await fetch(SummaryApi.resetPassword.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: form.newPassword }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      localStorage.removeItem("resetEmail");
      window.location.href = "/login";
    } else {
      toast.error(data.message);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 via-emerald-100 to-teal-200 relative overflow-hidden">
      {/* Hiệu ứng nền ánh sáng mờ */}
      <div className="absolute w-72 h-72 bg-green-400/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-emerald-300/40 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Khối chính */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/70 shadow-2xl border border-white/30 rounded-3xl px-8 py-10 w-full max-w-md z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-100 p-4 rounded-full shadow-inner">
            <LockKeyhole size={36} className="text-green-600" />
          </div>
        </motion.div>

        <h2 className="text-center text-3xl font-extrabold text-green-700 mb-2">
          Đặt lại mật khẩu
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Nhập mật khẩu mới để bảo vệ tài khoản của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mật khẩu mới */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={form.newPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              required
              className="w-full bg-white/60 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none pr-10 text-gray-800 placeholder-gray-500 shadow-sm transition"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-green-600 transition"
            >
              {showNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
              className="w-full bg-white/60 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none pr-10 text-gray-800 placeholder-gray-500 shadow-sm transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-green-600 transition"
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Nút submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-green-300/60 transition-all"
          >
            Đặt lại mật khẩu
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ResetPassword;
