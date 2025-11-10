import React, { useContext, useState } from "react";
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin-panel");
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearchQuery);

  const handleLogout = async () => {
    const res = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    } else {
      toast.error(data.message || "Đăng xuất thất bại");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  const handleBlur = () => {
    setSearch("");
  };

  return (
    <header className="h-16 fixed w-full bg-white/80 backdrop-blur-md shadow-md z-40 transition-all duration-300">
      <div className="h-full container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-2 group">
          <Logo w={90} h={50} />
          <span className="font-bold text-lg text-gray-800 group-hover:text-red-600 transition-all duration-300">
            E-Shop
          </span>
        </Link>

        {/* Search bar */}
        {!isAdminPage && (
          <div className="hidden lg:flex items-center w-full justify-between max-w-md border border-gray-200 rounded-full pl-3 pr-1 py-1 bg-gray-50 hover:shadow-md transition duration-200 focus-within:ring-2 focus-within:ring-red-500">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 px-2"
              onChange={handleSearch}
              value={search}
              onBlur={handleBlur}
            />
            <div className="text-lg min-w-[45px] h-9 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center rounded-full text-white hover:from-red-600 hover:to-red-700 cursor-pointer transition">
              <GrSearch />
            </div>
          </div>
        )}

        {/* User + Cart + Login */}
        <div className="flex items-center gap-6">
          {/* User menu */}
          {user?._id && (
            <div className="relative flex justify-center">
              <div
                className="text-3xl cursor-pointer relative flex justify-center hover:text-red-600 transition duration-200"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-10 h-10 rounded-full border-2 border-red-500 object-cover"
                    alt={user?.name}
                  />
                ) : (
                  <FaRegCircleUser className="text-gray-700" />
                )}
              </div>

              {menuDisplay && (
                <div className="absolute top-12 right-0 bg-white shadow-xl rounded-lg border border-gray-100 w-48 py-2 animate-fadeIn">
                  <nav>
                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to={"/admin-panel/all-products"}
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                        onClick={() => setMenuDisplay(false)}
                      >
                        🛠 Trang Quản Lý
                      </Link>
                    )}
                    {user?.role !== ROLE.ADMIN && (
                      <Link
                        to={"/chang-password"}
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                        onClick={() => setMenuDisplay(false)}
                      >
                        🔑 Đổi mật khẩu
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          {user?._id && !isAdminPage && (
            <Link
              to={"/cart"}
              className="text-2xl relative text-gray-700 hover:text-red-600 transition duration-200"
            >
              <FaShoppingCart />
              {context?.cartProductCount > 0 && (
                <div className="absolute -top-2 -right-3 bg-red-600 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center animate-pulse">
                  {context?.cartProductCount}
                </div>
              )}
            </Link>
          )}

          {/* Login / Logout */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white rounded-xl shadow-md bg-gradient-to-r from-red-500 via-red-600 to-orange-500 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 opacity-0 transition-opacity duration-300 hover:opacity-100 blur-md"></span>
                <span className="relative z-10 font-semibold tracking-wide">
                  Đăng xuất
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white rounded-xl shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-pink-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-300 hover:opacity-100 blur-md"></span>
                <span className="relative z-10 font-semibold tracking-wide">
                  Đăng nhập
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
