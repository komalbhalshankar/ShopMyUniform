import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    school: "",
    studentClass: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://shopmyuniform-qhwu.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "16px",
          border: "1px solid #dbe3ef",
          boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            🎓
          </div>

          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Join ShopMyUniform and start shopping
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Class / Grade
            </label>

            <input
              type="text"
              name="studentClass"
              value={formData.studentClass}
              onChange={handleChange}
              placeholder="Enter your class"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              School
            </label>

            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter your school"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#172033",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#111827",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#111827",
  backgroundColor: "white",
  outline: "none",
};

export default Register;
