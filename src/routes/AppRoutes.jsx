import { Route, Routes } from "react-router-dom";
import Login from "../features/auth/Login.jsx";
import Register from "../features/auth/Register.jsx";
import Cart from "../features/cart/Cart.jsx";
import ProductDetails from "../features/catalog/ProductDetails.jsx";
import Products from "../features/catalog/Products.jsx";
import Checkout from "../features/orders/Checkout.jsx";
import OrderDetails from "../features/orders/OrderDetails.jsx";
import Orders from "../features/orders/Orders.jsx";
import AdminProducts from "../pages/AdminProducts.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Products />} path="/products" />
      <Route element={<ProductDetails />} path="/products/:productId" />
      <Route element={<Cart />} path="/cart" />
      <Route element={<Checkout />} path="/checkout" />
      <Route element={<Orders />} path="/orders" />
      <Route element={<OrderDetails />} path="/orders/:orderId" />
      <Route element={<AdminProducts />} path="/admin/products" />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}
