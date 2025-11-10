import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
      const result = await response.json();
      if (result.success) setData(result.data || []);
    } catch (err) {
      console.error("Lỗi fetch cart:", err);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadCart();
  }, []);

  const updateQuantity = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: qty }),
      });
      const result = await response.json();
      if (result.success) fetchData();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const result = await response.json();
      if (result.success) {
        fetchData();
        context.fetchUserAddToCart();
      }
    } catch (err) {
      console.error("Lỗi xoá sản phẩm:", err);
    }
  };

  const totalQty = data.reduce(
    (t, item) => (item?.productId ? t + item.quantity : t),
    0
  );
  const totalPrice = data.reduce(
    (t, item) =>
      item?.productId ? t + item.quantity * item.productId.sellingPrice : t,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-16">
      {/* Nút quay lại góc trái */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          ← Trang chủ
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Header */}
        <div className="flex justify-end items-center mb-10">
          <Link
            to="/myoder"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
          >
            Đơn hàng của tôi
          </Link>
        </div>

        {data.length === 0 && !loading && (
          <p className="text-center bg-white py-10 rounded-lg text-gray-600 text-lg shadow">
            Giỏ hàng trống. Hãy thêm sản phẩm nhé 💖
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))
              : data.map((product) => {
                  const item = product.productId;
                  if (!item) return null;
                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex hover:shadow-lg transition-all"
                    >
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={item.productImage?.[0]}
                          alt={item.productName}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-4 relative">
                        <button
                          onClick={() => deleteCartProduct(product._id)}
                          className="absolute right-3 top-3 text-red-600 hover:bg-red-600 hover:text-white p-1 rounded-full transition"
                        >
                          <MdDelete size={20} />
                        </button>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {item.productName}
                          </h2>
                          <p className="text-sm text-gray-500 capitalize">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-red-600 font-bold text-lg">
                            {displayINRCurrency(item.sellingPrice)}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              className="border border-gray-400 text-gray-700 hover:bg-gray-700 hover:text-white w-7 h-7 rounded transition"
                              onClick={() =>
                                product.quantity > 1 &&
                                updateQuantity(
                                  product._id,
                                  product.quantity - 1
                                )
                              }
                            >
                              −
                            </button>
                            <span className="text-gray-800 font-medium">
                              {product.quantity}
                            </span>
                            <button
                              className="border border-gray-400 text-gray-700 hover:bg-gray-700 hover:text-white w-7 h-7 rounded transition"
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  product.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold text-gray-800">
                            {displayINRCurrency(
                              item.sellingPrice * product.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Tổng kết đơn hàng
            </h2>
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-700 text-base">
                <p>Số lượng sản phẩm:</p>
                <p className="font-semibold">{totalQty}</p>
              </div>
              <div className="flex justify-between text-gray-700 text-base">
                <p>Tổng giá:</p>
                <p className="font-semibold text-red-600">
                  {displayINRCurrency(totalPrice)}
                </p>
              </div>
            </div>
            <Link to="/payment">
              <button className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                Thanh toán ngay 💳
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
