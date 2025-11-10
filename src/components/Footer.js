import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 ">
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl font-playwrite font-bold  text-lime-400 mb-2">
            Shop Bán Hàng Điện Tử
          </h1>
          <p className="text-gray-400">Chất lượng và uy tín hàng đầu</p>
        </div>

        <div className="text-center md:text-right space-y-1">
          <h2 className="font-semibold text-blue-500 text-xl mr-14 mb-2">
            Liên hệ
          </h2>
          <p className="hover:text-lime-400 transition-colors cursor-pointer">
            📞 Phone: <a href="tel:098765432">0987 654 321</a>
          </p>
          <p className="hover:text-lime-400 transition-colors cursor-pointer">
            📧 Email: <a href="mailto:a@gmail.com">a@gmail.com</a>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; 2025 Shop Bán Hàng Điện Tử.
        <span className="text-xl ml-8 font-bold font-pacifico  text-pink-600">
          Uy Tín
        </span>
      </div>
    </footer>
  );
};

export default Footer;
