import { useEffect, useState } from "react";
import api from "./api";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import "./styles.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("price-asc");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false); // ✅ NEW: loading state
  const [message, setMessage] = useState(""); // ✅ NEW: toast message

  const fetchProducts = async () => {
    try {
      setLoading(true); // start loading
      const params = {};
      if (query) params.q = query;
      if (sort) params.sort = sort;
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [sort, query]);

  const addProduct = async (data) => {
    await api.post("/products", data);
    await fetchProducts();
    showMessage("✅ Product added successfully");
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    await fetchProducts();
    showMessage("🗑️ Product deleted successfully");
  };

  const updateProduct = async (id, update) => {
    await api.put(`/products/${id}`, update);
    await fetchProducts();
    showMessage("✏️ Product updated successfully");
  };

  // ✅ helper for showing toast messages
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000); // auto-hide after 3s
  };

  return (
    <div className="container">
      <h1>Product Management</h1>

      {/* ✅ Success Toast */}
      {message && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="controls">
        <SearchBar query={query} setQuery={setQuery} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      <ProductForm onAdd={addProduct} />

      {/* ✅ Loading State */}
      {loading ? (
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading products...</p>
        </div>
      ) : (
        <ProductList
          products={products}
          onDelete={deleteProduct}
          onUpdate={updateProduct}
        />
      )}
    </div>
  );
}
