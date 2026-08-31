import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setMessage("");

      // ==========================================
      // GET STATISTICS
      // ==========================================

      const statsResponse = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const statsData = await statsResponse.json();

      setStats(statsData);

      // ==========================================
      // GET USERS
      // ==========================================

      const usersResponse = await fetch(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();

        setUsers(usersData.users || []);
      }

      // ==========================================
      // GET ALL ORDERS
      // ==========================================

      const ordersResponse = await fetch(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders");
      }

      const ordersData = await ordersResponse.json();

      const fetchedOrders = ordersData.orders || [];

      setOrders(fetchedOrders);

      // ==========================================
      // SET CURRENT ORDER STATUSES
      // ==========================================

      const statusMap = {};

      fetchedOrders.forEach((order) => {
        statusMap[order._id] = order.status;
      });

      setSelectedStatus(statusMap);

    } catch (error) {
      console.error("Admin dashboard error:", error);

      setMessage(
        "Failed to load dashboard data. Please try again."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
// DELETE USER
// ==========================================

const handleDeleteUser = async (userId, userName) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${userName}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setMessage("");

    const response = await fetch(
      `http://localhost:5000/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete user");
      return;
    }

    // Remove user immediately from screen
    setUsers((previousUsers) =>
      previousUsers.filter(
        (user) => user._id !== userId
      )
    );

    alert("User deleted successfully.");

  } catch (error) {
    console.error("Delete user error:", error);

    alert(
      "Server error. Please try again."
    );
  }
};

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange = async (orderId) => {
    try {
      setUpdatingOrder(orderId);

      const newStatus = selectedStatus[orderId];

      // ==========================================
      // SEND UPDATE TO BACKEND
      // ==========================================

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      // ==========================================
      // HANDLE ERROR
      // ==========================================

      if (!response.ok) {
        alert(
          data.message || "Failed to update order status"
        );

        return;
      }

      // ==========================================
      // UPDATE ORDER IMMEDIATELY ON SCREEN
      // ==========================================

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      // ==========================================
      // KEEP DROPDOWN IN SYNC
      // ==========================================

      setSelectedStatus((previousStatus) => ({
        ...previousStatus,
        [orderId]: data.order.status,
      }));

      // ==========================================
      // REFRESH DASHBOARD STATISTICS + ORDERS
      // ==========================================

      await fetchDashboardData(false);

      alert("Order status updated successfully!");

    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      alert(
        "Server error. Please try again."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Admin Dashboard</h1>

        <p>Loading dashboard...</p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-page">

      {/* ======================================
          HEADER
      ====================================== */}

     

<div className="admin-header">

  <div>
    <h1>Admin Dashboard</h1>

    <p>
      Welcome, <strong>ShopMyUniform Admin</strong>
    </p>
  </div>

  <div className="admin-header-actions">

    <Link to="/admin/products">
      <button type="button">
        Product Management
      </button>
    </Link>

    <Link to="/">
      <button type="button">
        ← Back to Store
      </button>
    </Link>

  </div>

</div>

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {message && (
        <p style={{ color: "red" }}>
          {message}
        </p>
      )}

      {/* ======================================
          STATISTICS
      ====================================== */}

      {stats && (
        <>
          <h2>Dashboard Statistics</h2>

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>

            <div className="stat-card">
              <h3>Students</h3>
              <p>{stats.totalStudents}</p>
            </div>

            <div className="stat-card">
              <h3>Parents</h3>
              <p>{stats.totalParents}</p>
            </div>

            <div className="stat-card">
              <h3>Products</h3>
              <p>{stats.totalProducts}</p>
            </div>

            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>

            <div className="stat-card">
              <h3>Pending Orders</h3>
              <p>{stats.pendingOrders}</p>
            </div>

            <div className="stat-card">
              <h3>Completed Orders</h3>
              <p>{stats.completedOrders}</p>
            </div>

            <div className="stat-card">
              <h3>Total Sales</h3>
              <p>₹{stats.totalSales}</p>
            </div>

          </div>
        </>
      )}

      {/* ======================================
          REGISTERED USERS
      ====================================== */}

      <h2>Registered Users</h2>

      <div className="table-container">

        <table>

          <thead>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Role</th>
    <th>School</th>
    <th>Class</th>
    <th>Action</th>
  </tr>
</thead>
          <tbody>

  {users.map((user) => (
    <tr key={user._id}>

      <td>{user.name}</td>

      <td>{user.email}</td>

      <td>{user.role}</td>

      <td>
        {user.school || "-"}
      </td>

      <td>
        {user.studentClass || "-"}
      </td>

      <td>

        {user.role === "admin" ? (

          <span>
            Admin
          </span>

        ) : (

          <button
            type="button"
            onClick={() =>
              handleDeleteUser(
                user._id,
                user.name
              )
            }
          >
            Delete
          </button>

        )}

      </td>

    </tr>
  ))}

</tbody>

        </table>

      </div>

      {/* ======================================
          ORDER MANAGEMENT
      ====================================== */}

      <div className="orders-section">

        <div className="section-heading">

          <div>
            <h2>Order Management</h2>

            <p>
              Manage customer orders and update
              their delivery status.
            </p>
          </div>

        </div>

        {orders.length === 0 ? (

          <div className="empty-state">

            <h3>No orders found</h3>

            <p>
              There are currently no customer orders.
            </p>

          </div>

        ) : (

          <div className="admin-orders">

            {orders.map((order) => (

              <div
                key={order._id}
                className="admin-order-card"
              >

                {/* ======================================
                    ORDER HEADER
                ====================================== */}

                <div className="order-header">

                  <div>

                    <h3>
                      Order #{order._id.slice(-6)}
                    </h3>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <span
                    className={`status-badge status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* ======================================
                    ORDER SUMMARY
                ====================================== */}

                <div className="order-summary">

                  <div>

                    <strong>
                      Total Amount
                    </strong>

                    <p>
                      ₹{order.totalAmount}
                    </p>

                  </div>

                  <div>

                    <strong>
                      Items
                    </strong>

                    <p>
                      {order.items.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      )}
                    </p>

                  </div>

                </div>

                {/* ======================================
                    ORDER ITEMS
                ====================================== */}

                <div className="order-items">

                  <h4>
                    Ordered Items
                  </h4>

                  {order.items.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="order-item"
                      >

                        <span>
                          {item.name}
                        </span>

                        <span>
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </span>

                      </div>

                    )
                  )}

                </div>

                {/* ======================================
                    STATUS CONTROL
                ====================================== */}

                <div className="status-control">

                  <label>
                    Update Status
                  </label>

                  <select
                    value={
                      selectedStatus[order._id] ||
                      order.status
                    }
                    onChange={(e) =>
                      setSelectedStatus(
                        (previousStatus) => ({
                          ...previousStatus,
                          [order._id]:
                            e.target.value,
                        })
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                  <button
                    onClick={() =>
                      handleStatusChange(
                        order._id
                      )
                    }
                    disabled={
                      updatingOrder ===
                      order._id
                    }
                  >

                    {updatingOrder ===
                    order._id
                      ? "Updating..."
                      : "Update Status"}

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;