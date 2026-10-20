import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-emoji">{product.image}</div>
      <span className="product-badge">
        {product.category === "cbc"
          ? "CBC"
          : product.category === "university"
          ? "University"
          : "International"}
      </span>
      <h3>{product.name}</h3>
      <div className="level">{product.level}</div>
      <div className="price">
        {product.currency} {product.price.toLocaleString()}
      </div>
    </Link>
  );
}
