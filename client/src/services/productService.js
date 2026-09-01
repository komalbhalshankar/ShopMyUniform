import axios from "axios";

const API_URL = "https://shopmyuniform-qhwv.onrender.com/api/products";

// Get all products
export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create product
export const createProduct = async (productData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
