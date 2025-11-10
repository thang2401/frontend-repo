import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Context from "../context";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import addToCart from "../helpers/addToCart";

const HorizontalCardProduct = ({ category, heading }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const { fetchUserAddToCart } = useContext(Context);

  const loadingSkeleton = Array.from({ length: 13 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await fetchCategoryWiseProduct(category);
    setProducts(result?.data || []);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScroll = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft +=
        direction === "right" ? scrollAmount : -scrollAmount;
    }
  };

  const handleAddToCart = async (e, productId) => {
    await addToCart(e, productId);
    fetchUserAddToCart();
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-xl uppercase font-semibold py-4">{heading}</h2>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block z-10 top-1/2 -translate-y-1/2"
          onClick={() => handleScroll("left")}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block z-10 top-1/2 -translate-y-1/2"
          onClick={() => handleScroll("right")}
        >
          <FaAngleRight />
        </button>

        <div
          className="flex gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all scroll-smooth"
          ref={scrollRef}
        >
          {/* Loading Skeleton */}
          {loading
            ? loadingSkeleton.map((_, index) => (
                <div
                  key={index}
                  className="min-w-[280px] md:min-w-[320px] max-w-[320px] h-36 bg-white rounded shadow flex animate-pulse"
                >
                  <div className="bg-slate-200 h-full p-4 w-[120px] md:w-[145px]" />
                  <div className="p-4 flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                      <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                    </div>
                    <div className="h-6 bg-slate-200 rounded-full w-full" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="min-w-[280px] md:min-w-[320px] max-w-[320px] h-40 bg-white rounded shadow flex"
                >
                  <div className="bg-slate-200 h-full p-4 w-[120px] md:w-[145px]">
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className="object-scale-down h-full hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="font-medium uppercase text-base md:text-lg line-clamp-1 text-black">
                        {product.productName}
                      </h2>
                      <p className="capitalize text-slate-500">
                        {product.category}
                      </p>
                      <div className="flex gap-3">
                        <p className="text-red-600 font-medium">
                          {displayINRCurrency(product.sellingPrice)}
                        </p>
                        <p className="text-slate-500 line-through">
                          {displayINRCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product._id)}
                      className="relative inline-flex items-center justify-center px-4 py-1.5 overflow-hidden text-sm font-medium text-white rounded-full shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-pink-300"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-300 hover:opacity-100 blur-md"></span>
                      <span className="relative z-10 font-semibold">
                        Thêm vào giỏ hàng
                      </span>
                    </button>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
