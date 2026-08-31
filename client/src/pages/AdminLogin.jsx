import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Make sure this is actually an admin
      if (data.user.role !== "admin") {
        setMessage(
          "Access denied. This account is not an administrator."
        );
        setLoading(false);
        return;
      }

      // Save admin login
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to admin dashboard
      navigate("/admin");

    } catch (error) {
      console.error("Admin login error:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Admin Login</h1>

        <p>
          Login to access the ShopMyUniform Admin Dashboard.
        </p>

        <form onSubmit={handleAdminLogin}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Admin email"
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Admin password"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Admin"}
          </button>

        </form>

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        <p>
          <Link to="/login">
            ← Back to User Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;