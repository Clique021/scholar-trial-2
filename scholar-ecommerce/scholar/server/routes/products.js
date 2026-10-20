import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "products.json");

const router = Router();

async function loadProducts() {
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

// GET /api/products?category=cbc|international&subcategory=Textbooks&q=search
router.get("/", async (req, res) => {
  try {
    const { category, subcategory, q } = req.query;
    let products = await loadProducts();

    if (category) {
      products = products.filter((p) => p.category === category);
    }
    if (subcategory) {
      products = products.filter(
        (p) => p.subcategory.toLowerCase() === subcategory.toLowerCase()
      );
    }
    if (q) {
      const term = q.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const products = await loadProducts();
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to load product" });
  }
});

export default router;
