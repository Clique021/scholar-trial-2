import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchOrder } from "../api.js";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) fetchOrder(orderId).then(setOrder).catch(() => {});
  }, [orderId]);

  return (
    <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
      <h1>🎉 Order Placed!</h1>
      <p>Thank you{order ? `, ${order.customer.name}` : ""}. Your order reference is:</p>
      <p style={{ fontWeight: 700, fontSize: "1.2rem" }}>{orderId}</p>
      {order && (
        <p>
          Total: {order.currency} {order.total.toLocaleString()} via {order.paymentMethod.toUpperCase()}
        </p>
      )}
      <Link to="/products" className="btn btn-primary" style={{ marginTop: 20, display: "inline-block" }}>
        Continue Shopping
      </Link>
    </div>
  );
}
