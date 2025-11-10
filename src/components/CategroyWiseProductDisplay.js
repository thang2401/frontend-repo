import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import addToCart from "../helpers/addToCart";
import scrollTop from "../helpers/scrollTop";
import Context from "../context";

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUserAddToCart } = useContext(Context);

  const loadingList = Array(13).fill(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchCategoryWiseProduct(category);
      setData(res?.data || []);
      setLoading(false);
    };

    fetchData();
  }, [category]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const renderLoadingCard = (_, index) => (
    <div
      key={index}
      className="w-full min-w-[280px] md:min-w-[320px] max-w-[320px] bg-white rounded-sm shadow"
    >
      <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse" />
      <div className="p-4 grid gap-3">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="h-5 bg-slate-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  );

  const renderProductCard = (product) => (
    <Link
      key={product?._id}
      to={`/product/${product?._id}`}
      className="w-full min-w-[280px] md:min-w-[320px] max-w-[320px] bg-white rounded-sm shadow"
      onClick={scrollTop}
    >
      <div className="bg-slate-200   h-48 p-4 flex justify-center items-center">
        <img
          src={product.productImage[0]}
          alt={product.productName}
          className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
        />
      </div>
      <div className="p-4 grid gap-3">
        <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-blue-700">
          {product?.productName}
        </h2>
        <p className="capitalize text-slate-500">{product?.category}</p>
        <div className=" gap-3">
          <span className="text-red-600 font-medium">
            {displayINRCurrency(product?.sellingPrice)}
          </span>

          <p className="text-slate-500 line-through">
            {displayINRCurrency(product?.price)}
          </p>
        </div>
        <button
          onClick={(e) => handleAddToCart(e, product?._id)}
          className="relative inline-flex items-center justify-center px-4 py-1.5 overflow-hidden text-sm font-medium text-white rounded-full shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-pink-300"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-300 hover:opacity-100 blur-md"></span>
          <span className="relative z-10 font-semibold">Thêm vào giỏ hàng</span>
        </button>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-x-scroll scrollbar-none transition-all">
        {loading
          ? loadingList.map(renderLoadingCard)
          : data.map(renderProductCard)}
      </div>
    </div>
  );
};

export default CategroyWiseProductDisplay;
