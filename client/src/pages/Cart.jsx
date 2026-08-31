import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="cart-page">

      {/* =========================
          CART HEADER
      ========================= */}

      <div className="cart-header">

        <div>
          <div className="cart-eyebrow">
            🛍️ ShopMyUniform
          </div>

          <h1>Shopping Cart</h1>

          <p className="cart-subtitle">
            Review your selected school uniforms before checkout.
          </p>

          <Link
            to="/"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>


      {/* =========================
          EMPTY CART
      ========================= */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added any uniforms yet.
          </p>

          <Link
            to="/"
            className="shop-now-button"
          >
            Browse Uniforms →
          </Link>

        </div>

      ) : (

        /* =========================
           CART WITH ITEMS
        ========================= */

        <div className="cart-layout">

          {/* =====================
              CART ITEMS
          ===================== */}

          <div>

            <div className="cart-items-heading">

              <h2>Your Items</h2>

              <span>
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"}
              </span>

            </div>


            {cart.map((product) => (

              <div
                className="cart-product-card"
                key={product._id}
              >

                {/* =================
                    PRODUCT IMAGE
                ================= */}

                <div className="cart-product-image">

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display =
                          "block";
                      }}
                    />
                  ) : null}

                  <span
                    style={{
                      display: product.image ? "none" : "block",
                    }}
                  >
                    👕
                  </span>

                </div>


                {/* =================
                    PRODUCT DETAILS
                ================= */}

                <div className="cart-product-details">

                  <span className="cart-product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="cart-product-description">
                    {product.description}
                  </p>


                  <div className="cart-product-info">

                    <span>
                      <strong>Size:</strong>{" "}
                      {product.size}
                    </span>

                    <span>
                      <strong>Price:</strong>{" "}
                      ₹{product.price} each
                    </span>

                  </div>


                  {/* =================
                      QUANTITY
                  ================= */}

                  <div className="quantity-section">

                    <span>
                      Quantity
                    </span>

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(product._id)
                        }
                        disabled={product.quantity <= 1}
                      >
                        −
                      </button>

                      <span>
                        {product.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(product._id)
                        }
                        disabled={
                          product.quantity >= product.stock
                        }
                      >
                        +
                      </button>

                    </div>

                    <small>
                      {product.stock} available
                    </small>

                  </div>

                </div>


                {/* =================
                    PRICE / REMOVE
                ================= */}

                <div className="cart-product-actions">

                  <div className="product-subtotal">
                    ₹{product.price * product.quantity}
                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(product._id)
                    }
                  >
                    🗑 Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <div className="order-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{totalPrice}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free-delivery">
                FREE
              </span>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{totalPrice}
              </strong>

            </div>


            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout →
            </Link>

            <div className="secure-checkout">
              🔒 Secure checkout
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;