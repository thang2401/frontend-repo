import React, { useEffect, useState } from "react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingButtons, setLoadingButtons] = useState({}); // lưu trạng thái nút đang bấm

  // Lấy tất cả đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://api.domanhhung.id.vn/api/orders"); // không cần token
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          console.warn("⚠ Dữ liệu không hợp lệ:", data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy đơn hàng:", err);
      }
    };

    fetchOrders();
  }, []);

  // Cập nhật trạng thái đơn hàng
  const updateStatus = async (orderId, newStatus) => {
    setLoadingButtons((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(
        `https://api.domanhhung.id.vn/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("⚠ " + data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      alert("Lỗi khi cập nhật trạng thái!");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      order.name?.toLowerCase().includes(lowerSearch) ||
      order.phone?.toLowerCase().includes(lowerSearch) ||
      order.address?.toLowerCase().includes(lowerSearch) ||
      order._id?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        🛒 Quản lý đơn hàng
      </h2>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm theo tên, số điện thoại, địa chỉ, mã đơn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-6"
      />

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">Không có đơn hàng nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isLoading = loadingButtons[order._id];

            return (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    📦 Đơn hàng #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Thời gian:{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </p>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>👤 Tên:</strong> {order.name}
                  </p>
                  <p>
                    <strong>📞 SĐT:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>📍 Địa chỉ:</strong> {order.address}
                  </p>
                  <p>
                    <strong>🔖 Trạng thái:</strong>{" "}
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
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    🛍️ Sản phẩm:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {order.items?.map((item, index) => {
                      const product = item.productId || {};
                      return (
                        <li key={index}>
                          {product.productName || "Sản phẩm không rõ"} -{" "}
                          <span className="text-gray-800 font-medium">
                            Số lượng: {item.quantity}
                          </span>{" "}
                          <span className="text-green-600 ml-4 font-semibold">
                            Giá:{" "}
                            {product.price
                              ? Number(product.price).toLocaleString("vi-VN") +
                                "₫"
                              : "Không rõ"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex gap-2 mt-4">
                  {order.status === "đang chờ xử lý" && (
                    <button
                      onClick={() => updateStatus(order._id, "đã xác nhận")}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-md text-white ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      Xác nhận
                    </button>
                  )}

                  {order.status === "đã xác nhận" && (
                    <button
                      onClick={() => updateStatus(order._id, "đang vận chuyển")}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-md text-white ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      Đang giao
                    </button>
                  )}

                  {order.status === "đang vận chuyển" && (
                    <button
                      onClick={() => updateStatus(order._id, "đã giao hàng")}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-md text-white ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Đã giao
                    </button>
                  )}
                </div>

                {order.status === "đã giao hàng" && (
                  <p className="mt-2 text-green-600 font-semibold">
                    ✅ Đơn hàng hoàn thành
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
