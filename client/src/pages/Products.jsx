import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { cart, addToCart } = useCart();

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 30px",
        boxSizing: "border-box",
      }}
    >

      {/* HERO */}

      <div
        style={{
          background: "linear-gradient(135deg, #172033, #304a70)",
          color: "white",
          padding: "50px",
          borderRadius: "20px",
          marginBottom: "45px",
        }}
      >
        <p style={{ fontSize: "16px" }}>
          🎓 School Uniform Store
        </p>

        <h1
          style={{
            color: "white",
            fontSize: "48px",
            margin: "15px 0",
          }}
        >
          Quality Uniforms.
          <br />
          Simple Shopping.
        </h1>

        <p style={{ fontSize: "18px" }}>
          Find comfortable and affordable school uniforms for every student.
        </p>

        <Link
          to="/cart"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 20px",
            background: "white",
            color: "#172033",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🛒 View Cart
        </Link>
      </div>

      {/* PRODUCTS HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <p
            style={{
              color: "#667085",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            OUR COLLECTION
          </p>

          <h2
            style={{
              fontSize: "34px",
              margin: "5px 0",
            }}
          >
            School Uniforms
          </h2>

          <p>
            {products.length} products available
          </p>
        </div>

        <Link
          to="/cart"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🛒 {totalItems} items
          <br />
          <span style={{ fontSize: "13px" }}>
            Go to Cart →
          </span>
        </Link>
      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="🔍 Search shirts, trousers, blazers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "14px 16px",
          marginBottom: "35px",
          border: "1px solid #d0d5dd",
          borderRadius: "10px",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      {/* PRODUCTS GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "25px",
          width: "100%",
        }}
      >

        {filteredProducts.map((product) => (
          <div
            key={product._id}
            style={{
              background: "white",
              border: "1px solid #e4e7ec",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >

            {/* PRODUCT IMAGE */}

<div
  style={{
    height: "180px",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }}
>
  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextSibling.style.display = "flex";
      }}
    />
  ) : null}

  <div
    style={{
      display: product.image ? "none" : "flex",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "70px",
    }}
  >
    {product.category.toLowerCase().includes("shirt")
      ? "👕"
      : product.category.toLowerCase().includes("trouser")
      ? "👖"
      : product.category.toLowerCase().includes("blazer")
      ? "🧥"
      : product.category.toLowerCase().includes("accessor")
      ? "🎒"
      : "🎓"}
  </div>
</div>

            {/* PRODUCT DETAILS */}

            <div
              style={{
                padding: "22px",
              }}
            >

              <p
                style={{
                  color: "#667085",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {product.category}
              </p>

              <h2
                style={{
                  fontSize: "21px",
                  margin: "8px 0",
                }}
              >
                {product.name}
              </h2>

              <p
                style={{
                  color: "#667085",
                  minHeight: "45px",
                }}
              >
                {product.description}
              </p>

              <h2
                style={{
                  fontSize: "26px",
                  margin: "15px 0",
                }}
              >
                ₹{product.price}
              </h2>

              <div
                style={{
                  borderTop: "1px solid #eee",
                  borderBottom: "1px solid #eee",
                  padding: "12px 0",
                  marginBottom: "15px",
                }}
              >
                <p>
                  <strong>Size:</strong> {product.size}
                </p>

                {product.stock > 0 ? (
                  <p style={{ color: "#039855" }}>
                    ● In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p style={{ color: "#d92d20" }}>
                    ● Out of Stock
                  </p>
                )}
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    product.stock === 0 ? "#d0d5dd" : "#172033",
                  color: "white",
                  fontWeight: "bold",
                  cursor:
                    product.stock === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : "🛒 Add to Cart"}
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* NO RESULTS */}

      {filteredProducts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          <h2>No products found</h2>
          <p>Try another search.</p>
        </div>
      )}

    </div>
  );
}

export default Products;