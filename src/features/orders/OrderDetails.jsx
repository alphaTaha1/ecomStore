import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import {
  ORDER_STATUS_LABELS,
  getOrder,
  shortOrderId,
  toDate,
} from "./orderService.js";
import useCurrentUser from "./useCurrentUser.js";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { user, ready } = useCurrentUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getOrder(orderId, user.uid)
      .then((result) => !cancelled && setOrder(result))
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("We couldn't load this order.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [ready, user, orderId]);

  if (!ready || loading) return <Loader label="Loading order..." />;

  if (!user || !order) {
    return (
      <section className="container content-section">
        <p className="eyebrow">Order information</p>
        <h1 className="page-heading">Order not found</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="placeholder-copy">
          {user ? "We couldn't find that order on your account." : "Sign in to view this order."}
        </p>
        <Link className="text-link" to={user ? "/orders" : "/login"}>
          {user ? "Back to your orders" : "Sign in"}
        </Link>
      </section>
    );
  }

  const date = toDate(order.createdAt);

  return (
    <section className="container content-section">
      <p className="eyebrow">Order information</p>
      <h1 className="page-heading">Order #{shortOrderId(order.id)}</h1>

      {state?.justPlaced && (
        <p className="form-success" role="status">
          Thank you! Your order has been placed.
        </p>
      )}

      <p className="placeholder-copy">
        Placed {date ? date.toLocaleString() : "just now"} ·{" "}
        <span className={`status-badge status-${order.status}`}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </p>

      <div className="cart-layout">
        <ul className="cart-list">
          {order.items.map((item) => (
            <li className="order-item" key={item.productId}>
              <Link className="cart-item-name" to={`/products/${item.productId}`}>
                {item.name}
              </Link>
              <span className="placeholder-copy">
                {formatCurrency(item.price)} × {item.quantity}
              </span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <h3>Ship to</h3>
          <address className="placeholder-copy">
            {order.shipping.fullName}
            <br />
            {order.shipping.address}
            <br />
            {order.shipping.city}, {order.shipping.postalCode}
            <br />
            {order.shipping.country}
            <br />
            {order.shipping.phone}
          </address>
          <h3>Payment</h3>
          <p className="placeholder-copy">
            Card ending in {order.payment.last4} ({order.payment.status})
          </p>
        </aside>
      </div>

      <Link className="text-link" to="/orders">
        Back to your orders
      </Link>
    </section>
  );
}
