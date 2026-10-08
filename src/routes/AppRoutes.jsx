import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../features/auth/Login.jsx";
import Register from "../features/auth/Register.jsx";
import Cart from "../features/cart/Cart.jsx";
import ProductDetails from "../features/catalog/ProductDetails.jsx";
import Products from "../features/catalog/Products.jsx";
import Checkout from "../features/orders/Checkout.jsx";
import OrderDetails from "../features/orders/OrderDetails.jsx";
import Orders from "../features/orders/Orders.jsx";
import AdminProducts from "../pages/AdminProducts.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* First page */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Store */}
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:orderId" element={<OrderDetails />} />

      {/* Admin */}
      <Route path="/admin/products" element={<AdminProducts />} />

      {/* Invalid pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}