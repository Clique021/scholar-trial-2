import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          Scholar Plug<span>.</span>
        </Link>
        <nav className="nav-links">
          <Link to="/products">All Products</Link>
          <Link to="/products?category=cbc">CBC</Link>
          <Link to="/products?category=international">International</Link>
          <Link to="/products?category=university">University</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/cart">
            Cart {count > 0 && <span className="cart-pill">{count}</span>}
          </Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
}
