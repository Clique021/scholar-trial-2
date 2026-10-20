import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ordersPath = path.join(__dirname, "..", "data", "orders.json");
const productsPath = path.join(__dirname, "..", "data", "products.json");

const router = Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

async function loadOrders() {
  try {
    const raw = await readFile(ordersPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveOrders(orders) {
  await writeFile(ordersPath, JSON.stringify(orders, null, 2));
}

async function loadProducts() {
  const raw = await readFile(productsPath, "utf-8");
  return JSON.parse(raw);
}

// POST /api/orders  { items: [{id, qty}], customer: {name, email, phone, address}, paymentMethod: "cod" | "mpesa" | "card" }
router.post("/", async (req, res) => {
  try {
    const { items, customer, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ error: "Customer name and phone are required" });
    }

    const products = await loadProducts();
    let total = 0;
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) throw new Error(`Unknown product: ${item.id}`);
      total += product.price * item.qty;
      return { ...product, qty: item.qty };
    });

    const order = {
      id: nanoid(10),
      items: lineItems,
      total,
      currency: "KES",
      customer,
      paymentMethod,
      status: paymentMethod === "cod" ? "pending-delivery" : "pending-payment",
      createdAt: new Date().toISOString(),
    };

    // Card payments: create a Stripe Checkout Session (test mode works with STRIPE_SECRET_KEY set)
    if (paymentMethod === "card") {
      if (!stripe) {
        return res.status(500).json({
          error:
            "Stripe is not configured. Add STRIPE_SECRET_KEY to server/.env to enable card payments.",
        });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems.map((li) => ({
          price_data: {
            currency: "kes",
            product_data: { name: li.name },
            unit_amount: Math.round(li.price * 100),
          },
          quantity: li.qty,
        })),
        success_url: `${process.env.CLIENT_URL}/order-success?order=${order.id}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout`,
        metadata: { orderId: order.id },
      });
      order.stripeSessionId = session.id;

      const orders = await loadOrders();
      orders.push(order);
      await saveOrders(orders);

      return res.json({ order, checkoutUrl: session.url });
    }

    // M-Pesa: stub. Wire this up to Safaricom's Daraja STK Push API using
    // MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET / MPESA_SHORTCODE / MPESA_PASSKEY.
    if (paymentMethod === "mpesa") {
      order.status = "awaiting-mpesa-stk-push";
      // TODO: call Daraja API here to trigger an STK push to customer.phone
    }

    const orders = await loadOrders();
    orders.push(order);
    await saveOrders(orders);

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create order" });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  const orders = await loadOrders();
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;
