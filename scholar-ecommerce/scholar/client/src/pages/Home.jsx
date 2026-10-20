import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const SCHOOLS = [
  { name: "School of Engineering (Architecture)", icon: "🏗️" },
  { name: "School of Computing and Informatics", icon: "💻" },
  { name: "School of Business", icon: "📊" },
  { name: "School of Medicine and Health Sciences", icon: "🩺" },
  { name: "School of Law", icon: "⚖️" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProducts().then((all) => setFeatured(all.slice(0, 4)));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Everything your scholar needs, in one place</h1>
          <p>
            Scholar Plug stocks CBC-approved textbooks and learning materials for
            Kenyan schools, Cambridge/IB/IGCSE resources for international
            schools, and faculty-specific materials for university scholars.
          </p>
          <div className="hero-actions">
            <Link to="/products?category=cbc" className="btn btn-primary">
              Shop CBC Supplies
            </Link>
            <Link to="/products?category=international" className="btn btn-outline">
              Shop International
            </Link>
            <Link to="/products?category=university" className="btn btn-outline">
              Shop University
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 style={{ marginTop: 40 }}>Featured items</h2>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 50 }}>
        <h2>University — shop by school</h2>
        <p className="level" style={{ marginBottom: 20 }}>
          Faculty-specific textbooks, kits, and references for university scholars.
        </p>
        <div className="product-grid">
          {SCHOOLS.map((s) => (
            <Link
              key={s.name}
              to={`/products?category=university&subcategory=${encodeURIComponent(s.name)}`}
              className="product-card"
            >
              <div className="product-emoji">{s.icon}</div>
              <span className="product-badge">University</span>
              <h3>{s.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
