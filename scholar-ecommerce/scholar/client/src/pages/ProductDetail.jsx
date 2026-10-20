import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(false);
    fetchProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="emoji-box">{product.image}</div>
        <div className="info">
          <span className="product-badge">
            {product.category === "cbc"
              ? "CBC"
              : product.category === "university"
              ? "University"
              : "International"}{" "}
            · {product.subcategory}
          </span>
          <h1>{product.name}</h1>
          <p className="level">{product.level}</p>
          <p>{product.description}</p>
          <div className="price">
            {product.currency} {product.price.toLocaleString()}
          </div>

          <div className="qty-row">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
            <span className="level">({product.stock} in stock)</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                addItem(product, qty);
                setAdded(true);
              }}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                addItem(product, qty);
                navigate("/cart");
              }}
            >
              Buy Now
            </button>
          </div>
          {added && <p style={{ color: "#1f6f4a", marginTop: 10 }}>Added to cart ✓</p>}
        </div>
      </div>
    </div>
  );
}
