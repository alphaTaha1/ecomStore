import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import {
  ORDER_STATUS_LABELS,
  getUserOrders,
  shortOrderId,
  toDate,
} from "./orderService.js";
import useCurrentUser from "./useCurrentUser.js";

export default function Orders() {
  const { user, ready } = useCurrentUser();
  const [orders, setOrders] = useState([]);
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
    getUserOrders(user.uid)
      .then((result) => !cancelled && setOrders(result))
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("We couldn't load your orders. Please try again.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  if (!ready || loading) return <Loader label="Loading your orders..." />;

  return (
    <section className="container content-section">
      <p className="eyebrow">Your account</p>
      <h1 className="page-heading">Your orders</h1>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {!user ? (
        <div className="empty-state">
          <p className="placeholder-copy">Sign in to see your order history.</p>
          <Link className="button" to="/login">
            Sign in
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h2 className="section-heading">No orders yet</h2>
          <p className="placeholder-copy">Your orders will appear here once you've placed one.</p>
          <Link className="button" to="/products">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="order-list">
          {orders.map((order) => {
            const date = toDate(order.createdAt);
            const count = order.items.reduce((n, i) => n + i.quantity, 0);
            return (
              <li key={order.id}>
                <Link className="order-row" to={`/orders/${order.id}`}>
                  <div>
                    <strong>Order #{shortOrderId(order.id)}</strong>
                    <span className="placeholder-copy">
                      {date ? date.toLocaleDateString() : "Just now"} · {count}{" "}
                      {count === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <span className={`status-badge status-${order.status}`}>
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <strong>{formatCurrency(order.total)}</strong>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
