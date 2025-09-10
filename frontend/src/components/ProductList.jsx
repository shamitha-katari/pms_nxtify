import ProductCard from "./ProductCard";

export default function ProductList({ products, onDelete, onUpdate }) {
  if (!products.length) {
    return (
      <div className="text-center text-gray-500 p-6">
        <p className="text-lg font-medium">No products yet.</p>
        <p className="text-sm">Add your first product to get started </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
