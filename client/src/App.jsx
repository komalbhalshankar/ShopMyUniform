import { Link, Routes, Route } from "react-router-dom";
import { useCart } from "./context/CartContext";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";

import Chatbot from "./components/Chatbot";

function App() {
  const { cart } = useCart();

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <>
      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav className="navbar">
        <div className="logo">ShopMyUniform</div>

        <div className="nav-links">
          <Link to="/">Products</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart ({totalItems})
          </Link>

          {token && user ? (
            <>
              <Link to="/profile">Profile</Link>

              <Link to="/orders">My Orders</Link>

              {/* ADMIN DASHBOARD */}
              {user.role === "admin" && (
                <Link to="/admin">Admin Dashboard</Link>
              )}

              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>

              <Link to="/admin-login">Admin Login</Link>
            </>
          )}
        </div>
      </nav>

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Products />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      {/* ========================= */}
      {/* CHATBOT */}
      {/* ========================= */}

      <Chatbot />
    </>
  );
}

export default App;
