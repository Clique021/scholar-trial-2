import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import feedbackRouter from "./routes/feedback.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/feedback", feedbackRouter);

app.listen(PORT, () => {
  console.log(`Scholar Plug API running on http://localhost:${PORT}`);
});
