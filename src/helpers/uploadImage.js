const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`;

const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "mern_product");

  const dataResponse = await fetch(url, {
    method: "post",
    body: formData,
  });

  const result = await dataResponse.json();

  // Trả về secure_url thay vì url
  return result.secure_url;
};

export default uploadImage;
