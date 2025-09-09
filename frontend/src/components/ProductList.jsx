import ProductCard from "./ProductCard";

export default function ProductList({ products, onDelete, onUpdate }) {
  if (!products.length) return <p className="muted">No products yet.</p>;

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard
          key={p._id}
          product={p}
          onDelete={() => onDelete(p._id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
