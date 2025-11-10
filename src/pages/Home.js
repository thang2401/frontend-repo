import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct category={"airpodes"} heading={" Airpodes"} />
      <HorizontalCardProduct category={"watches"} heading={"Đồng hồ"} />

      <VerticalCardProduct
        category={"mobiles"}
        heading={"Điện thoại di động"}
      />
      <VerticalCardProduct category={"Mouse"} heading={"Chuột"} />
      <VerticalCardProduct category={"televisions"} heading={"Tivi"} />
      <VerticalCardProduct category={"camera"} heading={"Máy Ảnh"} />
      <VerticalCardProduct category={"earphones"} heading={"Tai nghe có dây"} />
      <VerticalCardProduct category={"speakers"} heading={"Loa Bluetooth"} />
      <VerticalCardProduct category={"refrigerator"} heading={"Tủ lạnh"} />
      <VerticalCardProduct category={"trimmers"} heading={"Máy cắt"} />
      <VerticalCardProduct category={"printers"} heading={"Máy in"} />
    </div>
  );
};

export default Home;
