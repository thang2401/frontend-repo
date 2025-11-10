import React, { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";

import SummaryApi from "../common/index";

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);
  const deleteCartProduct = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${SummaryApi.deleteProduct.url}/${id}`, {
        method: SummaryApi.deleteProduct.method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        alert("Xóa sản phẩm thành công!");
        fetchdata();
      } else {
        alert(responseData.message || "Xóa thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Có lỗi khi xóa sản phẩm!");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="w-40">
        <div className="flex justify-between mt-3">
          <div
            className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
            onClick={() => setEditProduct(true)}
            title="Chỉnh sửa"
          >
            <MdModeEditOutline />
          </div>

          <div
            className="p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer"
            onClick={() => deleteCartProduct(data._id)}
            title="Xóa sản phẩm"
          >
            <MdDelete />
          </div>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
