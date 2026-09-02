import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login before placing an order.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      const orderItems = cart.map((product) => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      }));

      const response = await fetch(
        "https://shopmyuniform-qhwu.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            items: orderItems,
            totalAmount: totalPrice,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order");
        return;
      }

      clearCart();

      alert("Order placed successfully!");

      console.log("Created order:", data.order);

      navigate("/orders");
    } catch (error) {
      console.error("Place order error:", error);

      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="checkout-header">
          <div>
            <div className="checkout-eyebrow">🔐 ShopMyUniform</div>

            <h1>Checkout</h1>

            <p>Review your order before placing it.</p>
          </div>

          <Link to="/cart" className="checkout-back-button">
            ← Back to Cart
          </Link>
        </div>

        {/* =========================
            EMPTY CART
        ========================= */}

        {cart.length === 0 ? (
          <div className="checkout-empty">
            <div className="checkout-empty-icon">🛒</div>

            <h2>Your cart is empty</h2>

            <p>Add some school uniforms before proceeding to checkout.</p>

            <Link to="/" className="checkout-shop-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* =========================
             CHECKOUT LAYOUT
          ========================= */

          <div className="checkout-layout">
            {/* =========================
                ORDER ITEMS
            ========================= */}

            <div>
              <div className="checkout-section-heading">
                <div>
                  <h2>Order Items</h2>

                  <p>
                    {totalItems} {totalItems === 1 ? "item" : "items"} in your
                    order
                  </p>
                </div>
              </div>

              <div className="checkout-items">
                {cart.map((product) => (
                  <div key={product._id} className="checkout-product-card">
                    {/* IMAGE */}

                    <div className="checkout-product-image">
                      {product.category?.toLowerCase() === "shirt"
                        ? "👕"
                        : product.category?.toLowerCase() === "trousers"
                          ? "👖"
                          : product.category?.toLowerCase() === "blazer"
                            ? "🧥"
                            : product.category?.toLowerCase() === "accessories"
                              ? "🎒"
                              : "🎓"}
                    </div>

                    {/* DETAILS */}

                    <div className="checkout-product-details">
                      <span className="checkout-product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      {product.description && <p>{product.description}</p>}

                      <div className="checkout-product-info">
                        <span>
                          <strong>Price:</strong> ₹{product.price}
                        </span>

                        <span>
                          <strong>Quantity:</strong> {product.quantity}
                        </span>
                      </div>
                    </div>

                    {/* SUBTOTAL */}

                    <div className="checkout-product-subtotal">
                      <span>SUBTOTAL</span>

                      <strong>₹{product.price * product.quantity}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================
                ORDER SUMMARY
            ========================= */}

            <div className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="checkout-summary-row">
                <span>Items</span>

                <strong>{totalItems}</strong>
              </div>

              <div className="checkout-summary-row">
                <span>Subtotal</span>

                <strong>₹{totalPrice}</strong>
              </div>

              <div className="checkout-summary-row">
                <span>Delivery</span>

                <strong className="checkout-free">FREE</strong>
              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-total">
                <span>Total</span>

                <strong>₹{totalPrice}</strong>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="checkout-place-button"
              >
                Place Order →
              </button>

              <div className="checkout-secure">🔒 Secure checkout</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
