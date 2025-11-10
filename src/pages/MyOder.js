import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  User,
  Phone,
  MapPin,
  CalendarDays,
  Package,
} from "lucide-react";
import Swal from "sweetalert2"; // ✅ thêm thư viện này

const MyOrders = () => {
  const user = useSelector((state) => state?.user?.user);
  const userId = user?._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${SummaryApi.getUserOrders.url}/${userId}`, {
        method: SummaryApi.getUserOrders.method,
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) setOrders(result.data || []);
      else setOrders([]);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId, fetchOrders]);

  // ✅ SweetAlert2 cho hủy đơn
  const handleDeleteOrder = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Bạn có chắc muốn hủy đơn hàng này?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vâng, hủy ngay!",
      cancelButtonText: "Không, để sau",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${SummaryApi.deleteOrder.url}/${orderId}`, {
        method: SummaryApi.deleteOrder.method,
        credentials: "include",
      });
      const result = await res.json();

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Đã hủy đơn hàng!",
          text: "Đơn hàng của bạn đã được hủy thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchOrders();
      } else {
        Swal.fire({
          icon: "error",
          title: "Hủy thất bại!",
          text: result.message || "Vui lòng thử lại sau.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi khi hủy đơn hàng!",
        text: "Không thể kết nối đến máy chủ.",
      });
    }
  };

  if (!userId)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-red-600 font-semibold">
            🔒 Vui lòng đăng nhập để xem đơn hàng của bạn.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <Link
        to="/cart"
        className="fixed top-5 left-5 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition flex items-center gap-2 z-50"
      >
        <ShoppingCart size={20} />
        <span className="font-medium text-sm">Giỏ hàng</span>
      </Link>

      <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800 drop-shadow-sm">
        🧾 Đơn hàng của tôi
      </h2>

      {loading ? (
        <div className="text-center text-gray-600 text-lg animate-pulse">
          Đang tải đơn hàng...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 italic bg-white p-8 rounded-xl shadow-sm">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-10">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-1">
                  <p className="text-gray-600 flex items-center gap-2">
                    <CalendarDays size={16} /> Ngày đặt:{" "}
                    <span className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Package size={16} /> Mã đơn hàng:{" "}
                    <span className="font-semibold text-gray-800">
                      {order._id}
                    </span>
                  </p>
                </div>

                {/* ✅ Chỉ hiển thị nút Hủy nếu đơn chưa vận chuyển hoặc giao */}
                {order.status !== "đang vận chuyển" &&
                  order.status !== "đã giao hàng" && (
                    <div className="mt-3 md:mt-0">
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm"
                      >
                        Hủy đơn
                      </button>
                    </div>
                  )}
              </div>

              <div className="p-6 grid md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User size={18} /> Thông tin khách hàng
                  </h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <User size={14} /> {order.name}
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone size={14} /> {order.phone}
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin size={14} /> {order.address}
                    </li>
                  </ul>
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🛍️ Sản phẩm đã đặt
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items?.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                      >
                        <img
                          src={
                            item.productId?.productImage?.[0] ||
                            "https://via.placeholder.com/100"
                          }
                          alt={item.productId?.productName || "Sản phẩm"}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold text-gray-800 text-base">
                            {item.productId?.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Số lượng:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="text-sm text-red-600 font-semibold">
                            Giá:{" "}
                            {displayINRCurrency(
                              (item.productId?.sellingPrice || 0) *
                                item.quantity
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <p className="text-sm text-gray-700">
                  <strong>Trạng thái đơn hàng:</strong>{" "}
                  <span
                    className={`ml-1 px-2 py-0.5 rounded text-xs ${
                      order.status === "đang chờ xử lý"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "đã xác nhận"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "đang vận chuyển"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "đã giao hàng"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
