import React, { useState } from "react";
import { submitFeedback } from "../api.js";

const RATINGS = [1, 2, 3, 4, 5];

export default function Feedback() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await submitFeedback({ ...form, rating });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setRating(5);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 560, padding: "40px 20px 60px" }}>
      <h1>We'd love your feedback</h1>
      <p className="level">
        Tell us what's working, what's missing, or what would make Scholar
        Plug better for your school or family.
      </p>

      {status === "success" ? (
        <div className="cart-summary" style={{ marginLeft: 0, maxWidth: "none" }}>
          <p>🎉 Thanks for your feedback — we read every submission.</p>
          <button className="btn btn-secondary" onClick={() => setStatus("idle")}>
            Submit another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div className="field">
            <label>Name</label>
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="field">
            <label>Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="field">
            <label>Rating</label>
            <div style={{ display: "flex", gap: 6 }}>
              {RATINGS.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  style={{
                    fontSize: "1.4rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: n <= rating ? 1 : 0.3,
                  }}
                  aria-label={`${n} star`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Your feedback</label>
            <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>

          {status === "error" && <p style={{ color: "crimson" }}>{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={status === "loading"} style={{ width: "100%" }}>
            {status === "loading" ? "Sending…" : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
