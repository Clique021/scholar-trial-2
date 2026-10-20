import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { placeOrder } from "../api.js";

const METHODS = [
  { value: "mpesa", label: "M-Pesa", hint: "Pay via STK push to your phone" },
  { value: "card", label: "Card (Stripe)", hint: "Visa, Mastercard, etc." },
  { value: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives" },
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [method, setMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        customer: form,
        paymentMethod: method,
      };
      const result = await placeOrder(payload);

      if (method === "card" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      clearCart();
      navigate(`/order-success?order=${result.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <div className="container empty-state">Your cart is empty.</div>;
  }

  return (
    <div className="container checkout-grid">
      <form onSubmit={handleSubmit}>
        <h2>Delivery Details</h2>
        <div className="field">
          <label>Full name</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="field">
          <label>Phone (for M-Pesa / delivery)</label>
          <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="07XXXXXXXX" />
        </div>
        <div className="field">
          <label>Delivery address</label>
          <textarea required rows={3} value={form.address} onChange={(e) => update("address", e.target.value)} />
        </div>

        <h2>Payment Method</h2>
        <div className="payment-options">
          {METHODS.map((m) => (
            <label key={m.value} className={method === m.value ? "selected" : ""}>
              <input
                type="radio"
                name="method"
                value={m.value}
                checked={method === m.value}
                onChange={() => setMethod(m.value)}
              />
              <div>
                <strong>{m.label}</strong>
                <div className="level">{m.hint}</div>
              </div>
            </label>
          ))}
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Placing order…" : `Place Order · KES ${total.toLocaleString()}`}
        </button>
      </form>

      <div className="cart-summary" style={{ alignSelf: "start" }}>
        <h3>Order Summary</h3>
        {items.map((i) => (
          <div className="row" key={i.id}>
            <span>{i.name} × {i.qty}</span>
            <span>KES {(i.price * i.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="row total">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
