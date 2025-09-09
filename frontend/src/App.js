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

  const fetchProducts = async () => {
    const params = {};
    if (query) params.q = query;
    if (sort) params.sort = sort;
    const res = await api.get("/products", { params });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [sort, query]);

  const addProduct = async (data) => {
    await api.post("/products", data);
    await fetchProducts(); // keep list sorted/search-filtered
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    await fetchProducts();
  };

  const updateProduct = async (id, update) => {
    await api.put(`/products/${id}`, update);
    await fetchProducts();
  };

  return (
    <div className="container">
      <h1>Product Management</h1>

      <div className="controls">
        <SearchBar query={query} setQuery={setQuery} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      <ProductForm onAdd={addProduct} />

      <ProductList
        products={products}
        onDelete={deleteProduct}
        onUpdate={updateProduct}
      />
    </div>
  );
}

