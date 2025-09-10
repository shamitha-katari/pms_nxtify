import { useState } from "react";

export default function ProductForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    const p = Number(form.price);
    if (form.price === "" || Number.isNaN(p) || p < 0)
      errs.price = "Valid non-negative price is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = { ...form, price: Number(form.price) };
    await onAdd(payload);

    setForm({ name: "", price: "", description: "", category: "" });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <div className="form">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <small className="error">{errors.name}</small>}
      </div>

      <div className="form">
        <label>Price</label>
        <input name="price" value={form.price} onChange={handleChange} />
        {errors.price && <small className="error">{errors.price}</small>}
      </div>

      <div className="form">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="form">
        <label>Category</label>
        <input name="category" value={form.category} onChange={handleChange} />
      </div>
      <div className="form">
      <button type="submit">Add</button>
      </div>
    </form>
  );
}
