import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice,
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = (index) => {
    const updatedImages = [...data.productImage];
    updatedImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: updatedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      toast.success(result.message);
      onClose();
      fetchdata();
    } else if (result.error) {
      toast.error(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-2xl h-full max-h-[90%] overflow-hidden relative shadow-lg">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h2 className="font-bold ml-60 text-blue-500 text-lg">
            Chỉnh sửa sản phẩm
          </h2>
          <button
            className="text-2xl text-gray-600 hover:text-red-600"
            onClick={onClose}
          >
            <CgClose />
          </button>
        </div>

        <form
          className="grid gap-3 overflow-y-auto h-full pb-6 pr-2"
          onSubmit={handleSubmit}
        >
          <label>
            Tên sản phẩm:
            <input
              type="text"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              className="p-2 mt-1 w-full bg-slate-100 border rounded"
              required
            />
          </label>

          <label>
            Tên thương hiệu:
            <input
              type="text"
              name="brandName"
              value={data.brandName}
              onChange={handleOnChange}
              className="p-2 mt-1 w-full bg-slate-100 border rounded"
              required
            />
          </label>

          <label>
            Danh mục:
            <select
              name="category"
              value={data.category}
              onChange={handleOnChange}
              className="p-2 mt-1 w-full bg-slate-100 border rounded"
              required
            >
              <option value="">Chọn danh mục</option>
              {productCategory.map((el, index) => (
                <option key={index} value={el.value}>
                  {el.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Hình ảnh sản phẩm:
            <div className="p-2 bg-slate-100 border rounded h-32 flex justify-center items-center cursor-pointer mt-1">
              <label
                htmlFor="uploadImageInput"
                className="w-full h-full flex flex-col items-center justify-center text-slate-500 cursor-pointer"
              >
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Tải lên hình ảnh</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </label>
            </div>
          </label>

          {data.productImage.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {data.productImage.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`img-${idx}`}
                    className="w-20 h-20 object-cover border rounded cursor-pointer"
                    onClick={() => {
                      setOpenFullScreenImage(true);
                      setFullScreenImage(img);
                    }}
                  />
                  <div
                    className="absolute bottom-1 right-1 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                    onClick={() => handleDeleteProductImage(idx)}
                  >
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Giá */}
          <label>
            Giá:
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={handleOnChange}
              className="p-2 mt-1 w-full bg-slate-100 border rounded"
              required
            />
          </label>

          {/* Giá đang bán */}
          <label>
            Giá đang bán:
            <input
              type="number"
              name="sellingPrice"
              value={data.sellingPrice}
              onChange={handleOnChange}
              className="p-2 mt-1 w-full bg-slate-100 border rounded"
              required
            />
          </label>

          {/* Mô tả */}
          <label>
            Mô tả:
            <textarea
              name="description"
              value={data.description}
              onChange={handleOnChange}
              className="p-2 mt-1 h-28 w-full bg-slate-100 border rounded resize-none"
              placeholder="Mô tả sản phẩm..."
              required
            />
          </label>

          {/* Submit */}
          <button className="mt-2 mb-7 py-2 px-4 bg-red-600 text-white hover:bg-red-700 rounded">
            Cập nhật sản phẩm
          </button>
        </form>

        {/* Hiển thị ảnh full màn */}
        {openFullScreenImage && (
          <DisplayImage
            onClose={() => setOpenFullScreenImage(false)}
            imgUrl={fullScreenImage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminEditProduct;
