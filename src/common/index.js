const backendDomin = "https://api.domanhhung.id.vn";

const SummaryApi = {
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get",
  },
  // Dành cho SignUp
  verifySignUpOTP: {
    url: `${backendDomin}/api/verify-signup-otp`,
    method: "POST",
  },

  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomin}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomin}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomin}/api/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomin}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomin}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomin}/api/product-details`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomin}/api/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomin}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomin}/api/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomin}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomin}/api/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomin}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomin}/api/filter-product`,
    method: "post",
  },

  deleteProduct: {
    url: `${backendDomin}/api/products`,
    method: "delete",
  },
  updateOrderStatus: (orderId) => ({
    url: `http://localhost:8080/api/orders/${orderId}/status`,
    method: "PUT",
  }),
  deleteCart: {
    url: `${backendDomin}/api/delete-cart`,
    method: "delete",
  },
  processPayment: {
    url: `${backendDomin}/api/payment`,
    method: "POST",
  },
  confirmPayment: {
    url: `${backendDomin}/api/confirm-payment`,
    method: "POST",
  },

  cleanCart: {
    url: `${backendDomin}/api/clean-cart`,
    method: "DELETE",
  },
  orders: {
    url: `${backendDomin}/api/orders`,
    method: "GET",
  },
  deleteUser: {
    url: `${backendDomin}/api/delete-user`,
    method: "delete",
  },
  getUserOrders: {
    url: `${backendDomin}/api/user`,
    method: "GET",
  },
  deleteOrder: { url: `${backendDomin}/api/orders`, method: "DELETE" },
  forgotPassword: {
    url: `${backendDomin}/api/forgot-password`,
    method: "POST",
  },
  resetPassword: { url: `${backendDomin}/api/reset-password`, method: "POST" },
  changePassword: {
    url: `${backendDomin}/api/change-password`,
    method: "POST",
  },
  verifyOTP: { url: `${backendDomin}/api/verify-otp`, method: "POST" },
  twoFA_generate: {
    url: `${backendDomin}/api/2fa/generate`,
    method: "get",
  },
  twoFA_verify: {
    url: `${backendDomin}/api/2fa/verify`,
    method: "post",
  },
};

export default SummaryApi;
