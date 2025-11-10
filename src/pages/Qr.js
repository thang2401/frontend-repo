// src/pages/QrPayment.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const QrPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/");
  }, [state, navigate]);

  if (!state) return null;

  const { orderId, name, totalCost, products } = state;

  // Tạo link xác nhận: dùng window.location.origin để linh động với domain hiện tại
  // Ví dụ: https://your-domain.com/confirm-payment?orderId=123&amount=100000
  const confirmUrl = `${
    window.location.origin
  }/confirm-payment?orderId=${encodeURIComponent(
    orderId
  )}&amount=${encodeURIComponent(totalCost)}&products=${encodeURIComponent(
    products
  )}&name=${encodeURIComponent(name)}`;

  // ĐÃ SỬA LỖI: Biến 'qrText' không sử dụng đã bị xóa.
  /*
  const qrText = `Mời quét để xác nhận thanh toán\n${confirmUrl}`; 
  */

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Thanh Toán Online</h1>
      <p className="mb-2">Số tiền cần thanh toán:</p>
      <p className="text-red-600 font-bold text-2xl mb-4">{totalCost} VND</p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <QRCodeCanvas value={confirmUrl} size={250} />
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Quý khách quét mã QR để mở trang xác nhận thanh toán. <br />
        (Nếu camera không mở link tự động, hãy mở trình duyệt và dán link.)
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg"
      >
        Quay lại
      </button>
    </div>
  );
};

export default QrPayment;
