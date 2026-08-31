import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div>
              <h1>My Profile</h1>
              <p>View your ShopMyUniform account information.</p>
            </div>
          </div>

          <div className="profile-empty">
            <div className="profile-empty-icon">👤</div>

            <h2>Please login</h2>

            <p>
              Please login to view your profile information.
            </p>

            <Link
              to="/login"
              className="profile-login-button"
            >
              Go to Login →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* =========================
            PROFILE HEADER
        ========================= */}

        <div className="profile-header">

          <div>
            <h1>My Profile</h1>

            <p>
              View your ShopMyUniform account information.
            </p>
          </div>

          <Link
            to="/"
            className="profile-continue-button"
          >
            ← Continue Shopping
          </Link>

        </div>


        {/* =========================
            PROFILE CARD
        ========================= */}

        <div className="profile-card">

          <div className="profile-card-header">

            <div className="profile-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2>{user.name}</h2>

              <p>
                {user.role === "student"
                  ? "Student Account"
                  : user.role === "parent"
                  ? "Parent Account"
                  : "Admin Account"}
              </p>
            </div>

          </div>


          {/* =========================
              USER INFORMATION
          ========================= */}

          <div className="profile-information">

            <div className="profile-information-row">

              <span className="profile-label">
                Name
              </span>

              <span className="profile-value">
                {user.name}
              </span>

            </div>


            <div className="profile-information-row">

              <span className="profile-label">
                Email
              </span>

              <span className="profile-value">
                {user.email}
              </span>

            </div>


            <div className="profile-information-row">

              <span className="profile-label">
                Role
              </span>

              <span className="profile-value profile-role">
                {user.role}
              </span>

            </div>


            <div className="profile-information-row">

              <span className="profile-label">
                School
              </span>

              <span className="profile-value">
                {user.school || "Not selected"}
              </span>

            </div>


            <div className="profile-information-row">

              <span className="profile-label">
                Class / Grade
              </span>

              <span className="profile-value">
                {user.studentClass || "Not selected"}
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;