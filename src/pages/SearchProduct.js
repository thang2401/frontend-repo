import React, { useEffect, useState, useCallback } from "react"; // Đã thêm useCallback
import { useLocation } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("query", query.search);

  // ĐÃ SỬA LỖI: Bọc hàm fetchProduct trong useCallback
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.searchProduct.url + query.search);
    const dataResponse = await response.json();
    setLoading(false);

    setData(dataResponse.data);
  }, [query.search]); // QUAN TRỌNG: Thêm query.search làm dependency cho hàm fetchProduct

  useEffect(() => {
    // ĐÃ SỬA LỖI: Thêm fetchProduct vào mảng dependency
    fetchProduct();
  }, [query, fetchProduct]); // Thêm query và fetchProduct

  return (
    <div className="container mx-auto p-4">
      {loading && <p className="text-lg text-center">Đang tải...</p>}

      <p className="text-lg font-semibold my-3">
        Kết quả tìm kiếm : {data.length}
      </p>

      {data.length === 0 && !loading && (
        <p className="bg-white text-lg text-center p-4">
          Không có sản phẩm phù hợp....
        </p>
      )}

      {data.length !== 0 && !loading && (
        <VerticalCard loading={loading} data={data} />
      )}
    </div>
  );
};

export default SearchProduct;
