import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setMessage("Please login to view your orders.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        const response = await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch orders");
          setLoading(false);
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Fetch orders error:", error);
        setMessage("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h1>My Orders</h1>
          <p className="orders-loading">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="orders-header">
          <div>
            <h1>My Orders</h1>

            <p>
              Track your school uniform orders and delivery status.
            </p>
          </div>

          <Link
            to="/"
            className="orders-continue-button"
          >
            ← Continue Shopping
          </Link>
        </div>


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {message && (
          <div className="orders-message">
            {message}
          </div>
        )}


        {/* =========================
            EMPTY ORDERS
        ========================= */}

        {!message && orders.length === 0 && (
          <div className="empty-orders">

            <div className="empty-orders-icon">
              📦
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/"
              className="shop-now-button"
            >
              Start Shopping →
            </Link>

          </div>
        )}


        {/* =========================
            ORDERS LIST
        ========================= */}

        {!message && orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => {

              const totalItems = order.items.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              );

              return (
                <div
                  className="customer-order-card"
                  key={order._id}
                >

                  {/* =====================
                      ORDER HEADER
                  ===================== */}

                  <div className="customer-order-header">

                    <div>
                      <h2>
                        Order #{order._id.slice(-6)}
                      </h2>

                      <p>
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`customer-status-badge status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                  </div>


                  {/* =====================
                      ORDER SUMMARY
                  ===================== */}

                  <div className="customer-order-summary">

                    <div>
                      <span>Total Amount</span>

                      <strong>
                        ₹{order.totalAmount}
                      </strong>
                    </div>

                    <div>
                      <span>Items</span>

                      <strong>
                        {totalItems}
                      </strong>
                    </div>

                  </div>


                  {/* =====================
                      ORDER ITEMS
                  ===================== */}

                  <div className="customer-order-items">

                    <h3>
                      Ordered Items
                    </h3>

                    {order.items.map(
                      (item, index) => (

                        <div
                          className="customer-order-item"
                          key={index}
                        >

                          <div>
                            <strong>
                              {item.name}
                            </strong>

                            <p>
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <strong>
                            ₹
                            {item.price *
                              item.quantity}
                          </strong>

                        </div>

                      )
                    )}

                  </div>


                  {/* =====================
                      ORDER FOOTER
                  ===================== */}

                  <div className="customer-order-footer">

                    <span>
                      Order Total
                    </span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;