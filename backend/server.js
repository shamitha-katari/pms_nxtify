import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- DB connect ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- Product schema/model ---
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    category: { type: String, default: "" }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

// --- Routes ---
// GET /api/products?q=<name>&sort=price-asc|price-desc
app.get("/api/products", async (req, res, next) => {
  try {
    const { q, sort } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };

    let query = Product.find(filter);
    if (sort === "price-asc") query = query.sort({ price: 1 });
    if (sort === "price-desc") query = query.sort({ price: -1 });

    const products = await query.exec();
    res.json(products);
  } catch (e) {
    next(e);
  }
});

// POST /api/products
app.post("/api/products", async (req, res, next) => {
  try {
    const { name, price, description, category } = req.body;
    const created = await Product.create({ name, price, description, category });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/products/:id
app.delete("/api/products/:id", async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (e) {
    next(e);
  }
});

// (Optional) PUT /api/products/:id for edit
app.put("/api/products/:id", async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// --- Basic error handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
