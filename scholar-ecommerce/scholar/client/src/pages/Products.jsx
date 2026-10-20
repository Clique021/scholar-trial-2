import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const TABS = [
  { label: "All", value: "" },
  { label: "CBC (Kenya)", value: "cbc" },
  { label: "International", value: "international" },
  { label: "University", value: "university" },
];

const SCHOOLS = [
  "School of Engineering (Architecture)",
  "School of Computing and Informatics",
  "School of Business",
  "School of Medicine and Health Sciences",
  "School of Law",
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const school = searchParams.get("subcategory") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (category === "university" && school) params.subcategory = school;
    fetchProducts(params)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, school]);

  function selectCategory(value) {
    setSearchParams(value ? { category: value } : {});
  }

  function selectSchool(value) {
    setSearchParams(
      value ? { category: "university", subcategory: value } : { category: "university" }
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginTop: 30 }}>School Supplies</h1>
      <div className="category-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`tab ${category === tab.value ? "active" : ""}`}
            onClick={() => selectCategory(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {category === "university" && (
        <div className="category-tabs" style={{ marginTop: -10 }}>
          <button
            className={`tab ${!school ? "active" : ""}`}
            onClick={() => selectSchool("")}
          >
            All Schools
          </button>
          {SCHOOLS.map((s) => (
            <button
              key={s}
              className={`tab ${school === s ? "active" : ""}`}
              onClick={() => selectSchool(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found in this category.</div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
