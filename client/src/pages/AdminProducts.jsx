import { useEffect, useState } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

function AdminProducts() {
  // ==========================================
  // PRODUCTS
  // ==========================================

  const [products, setProducts] = useState([]);

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    size: "",
    stock: "",
    image: "",
  });

  // ==========================================
  // EDIT MODE
  // ==========================================

  const [editingId, setEditingId] = useState(null);

  // ==========================================
  // LOADING / MESSAGE
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);

      setMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PRODUCTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      size: "",
      stock: "",
      image: "",
    });

    setEditingId(null);
    setMessage("");
  };

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        size: formData.size,
        stock: Number(formData.stock),
        image: formData.image,
      };

      // ==========================================
      // UPDATE EXISTING PRODUCT
      // ==========================================

      if (editingId) {
        await updateProduct(editingId, productData);

        setMessage("Product updated successfully.");
      }

      // ==========================================
      // CREATE NEW PRODUCT
      // ==========================================

      else {
        await createProduct(productData);

        setMessage("Product added successfully.");
      }

      // Refresh products
      await loadProducts();

      // Clear form
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        size: "",
        stock: "",
        image: "",
      });

      setEditingId(null);
    } catch (error) {
      console.error("Product save error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price ?? "",
      size: product.size || "",
      stock: product.stock ?? "",
      image: product.image || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      await deleteProduct(id);

      setMessage("Product deleted successfully.");

      await loadProducts();
    } catch (error) {
      console.error("Product delete error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Product Management</h1>

        <p>Loading products...</p>
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
          <h1>Product Management</h1>

          <p>
            Add, edit and manage ShopMyUniform
            products.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
        >
          {editingId
            ? "Cancel Edit"
            : "Clear Form"}
        </button>

      </div>


      {/* ======================================
          MESSAGE
      ====================================== */}

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}


      {/* ======================================
          ADD / EDIT PRODUCT FORM
      ====================================== */}

      <div className="admin-form-card">

        <h2>
          {editingId
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* PRODUCT NAME */}

          <div className="form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: School Uniform"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              required
            />

          </div>


          {/* PRICE */}

          <div className="form-group">

            <label>
              Price (₹)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
            />

          </div>


          {/* SIZE */}

          <div className="form-group">

            <label>
              Size
            </label>

            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Example: M"
              required
            />

          </div>


          {/* STOCK */}

          <div className="form-group">

            <label>
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="0"
              required
            />

          </div>


          {/* IMAGE URL */}

          <div className="form-group">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>


          {/* CANCEL EDIT */}

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

        </form>

      </div>


      {/* ======================================
          PRODUCT LIST
      ====================================== */}

      <div className="admin-products-section">

        <h2>
          Existing Products
        </h2>

        {products.length === 0 ? (

          <div className="empty-state">

            <h3>
              No products found
            </h3>

            <p>
              Add your first product using
              the form above.
            </p>

          </div>

        ) : (

          <div className="admin-products-grid">

            {products.map((product) => (

              <div
                key={product._id}
                className="admin-product-card"
              >

                {/* ======================================
                    PRODUCT IMAGE
                ====================================== */}

                <div className="admin-product-image">

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement.querySelector(
                            ".no-image"
                          );

                        if (fallback) {
                          fallback.style.display =
                            "flex";
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className="no-image"
                    style={{
                      display: product.image
                        ? "none"
                        : "flex",
                    }}
                  >
                    No Image
                  </div>

                </div>


                {/* ======================================
                    PRODUCT DETAILS
                ====================================== */}

                <div className="admin-product-details">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {product.category}
                  </p>

                  <p>
                    <strong>
                      Size:
                    </strong>{" "}
                    {product.size}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    ₹{product.price}
                  </p>

                  <p>
                    <strong>
                      Stock:
                    </strong>{" "}
                    {product.stock}
                  </p>

                  <p>
                    {product.description}
                  </p>


                  {/* ======================================
                      ACTION BUTTONS
                  ====================================== */}

                  <div className="admin-product-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminProducts;