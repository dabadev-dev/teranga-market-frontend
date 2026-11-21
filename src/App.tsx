import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetail from "./pages/OrderDetail";
import MyOrders from "./pages/MyOrders";
import HomeLayout from "./layout/HomeLayout";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import SellerRoute from "./components/SellerRoute";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProductForm from "./pages/seller/SellerProductForm";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerPending from "./pages/seller/SellerPending";
import SellerLayout from "./layout/SellerLayout";

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Routes publiques */}
            <Route element={<HomeLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>
            {/* Routes d'authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes vendeuse */}
            <Route element={<SellerRoute />}>
              <Route element={<SellerLayout />}>
                <Route
                  path="/dashboard/vendeuse"
                  element={<SellerDashboard />}
                />

                <Route
                  path="/dashboard/vendeuse/produits"
                  element={<SellerProducts />}
                />

                <Route
                  path="/dashboard/vendeuse/produits/:id"
                  element={<ProductDetail />}
                />

                <Route
                  path="/dashboard/vendeuse/produits/nouveau"
                  element={<SellerProductForm />}
                />

                <Route
                  path="/dashboard/vendeuse/produits/:id/modifier"
                  element={<SellerProductForm />}
                />

                <Route
                  path="/dashboard/vendeuse/commandes"
                  element={<SellerOrders />}
                />
              </Route>
            </Route>

            <Route path="/vendeuse-en-attente" element={<SellerPending />} />

            {/* Routes administrateur */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />

                <Route
                  path="/dashboard/admin/vendeuses"
                  element={<AdminSellers />}
                />

                <Route
                  path="/dashboard/admin/produits"
                  element={<AdminProducts />}
                />

                <Route
                  path="/dashboard/admin/commandes"
                  element={<AdminOrders />}
                />

                <Route
                  path="/dashboard/admin/categories"
                  element={<AdminCategories />}
                />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
