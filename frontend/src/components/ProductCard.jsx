import { useState } from "react";

export default function ProductCard({ product, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    category: product.category || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "price" ? Number(value) : value }));
  };

  const save = async () => {
    await onUpdate(product._id, form);
    setIsEditing(false);
  };

  return (
    <div className="card">
      {isEditing ? (
        <>
          <input name="name" value={form.name} onChange={handleChange} />
          <input name="price" value={form.price} onChange={handleChange} />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <input name="category" value={form.category} onChange={handleChange} />
          <div className="row">
            <button onClick={save}>Save</button>
            <button className="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>{product.name}</h3>
          <p className="price">₹ {product.price}</p>
          {product.category && <p className="meta">{product.category}</p>}
          {product.description && <p>{product.description}</p>}
          <div className="row">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button className="danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
