import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Loader from "../../components/Loader.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import { useCart } from "../cart/CartContext.jsx";
import { placeOrder } from "./orderService.js";
import {
  SHIPPING_FIELDS,
  formatCardNumber,
  formatExpiry,
  digitsOnly,
  validatePayment,
  validateShipping,
} from "./orderValidation.js";
import useCurrentUser from "./useCurrentUser.js";

const emptyShipping = Object.fromEntries(SHIPPING_FIELDS.map((f) => [f.name, ""]));
const emptyPayment = { cardName: "", cardNumber: "", expiry: "", cvc: "" };

function Field({ label, error, ...props }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input aria-invalid={Boolean(error)} {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, ready } = useCurrentUser();
  const { items, subtotal, itemCount, loading, clearCart } = useCart();
  const [shipping, setShipping] = useState(emptyShipping);
  const [payment, setPayment] = useState(emptyPayment);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!ready || loading) return <Loader label="Preparing checkout..." />;

  if (!user) {
    return (
      <section className="container content-section">
        <p className="eyebrow">Almost there</p>
        <h1 className="page-heading">Checkout</h1>
        <div className="empty-state">
          <h2 className="section-heading">Sign in to continue</h2>
          <p className="placeholder-copy">
            Your cart is saved. Sign in to place your order.
          </p>
          <Link className="button" to="/login">
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="container content-section">
        <p className="eyebrow">Almost there</p>
        <h1 className="page-heading">Checkout</h1>
        <div className="empty-state">
          <h2 className="section-heading">Your cart is empty</h2>
          <Link className="button" to="/products">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  const setShip = (e) => setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));
  const setPay = (name, value) => setPayment((p) => ({ ...p, [name]: value }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = { ...validateShipping(shipping), ...validatePayment(payment) };
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const orderId = await placeOrder({
        uid: user.uid,
        cartItems: items,
        shipping,
        payment,
      });
      await clearCart();
      navigate(`/orders/${orderId}`, { replace: true, state: { justPlaced: true } });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "We couldn't place your order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="container content-section">
      <p className="eyebrow">Almost there</p>
      <h1 className="page-heading">Checkout</h1>

      <form className="checkout-layout" noValidate onSubmit={handleSubmit}>
        <div className="checkout-main">
          <fieldset className="form-card">
            <legend>Shipping details</legend>
            <div className="form-grid">
              {SHIPPING_FIELDS.map((f) => (
                <Field
                  autoComplete={f.autoComplete}
                  error={errors[f.name]}
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  onChange={setShip}
                  value={shipping[f.name]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="form-card">
            <legend>Payment (demo)</legend>
            <p className="placeholder-copy">
              This is a mock payment, no real charge is made. Use{" "}
              <code>4242 4242 4242 4242</code> to succeed or{" "}
              <code>4000 0000 0000 0002</code> to see a decline, any future expiry, any CVC.
            </p>
            <div className="form-grid">
              <Field
                autoComplete="cc-name"
                error={errors.cardName}
                label="Name on card"
                onChange={(e) => setPay("cardName", e.target.value)}
                value={payment.cardName}
              />
              <Field
                autoComplete="cc-number"
                error={errors.cardNumber}
                inputMode="numeric"
                label="Card number"
                onChange={(e) => setPay("cardNumber", formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                value={payment.cardNumber}
              />
              <Field
                autoComplete="cc-exp"
                error={errors.expiry}
                inputMode="numeric"
                label="Expiry (MM/YY)"
                onChange={(e) => setPay("expiry", formatExpiry(e.target.value))}
                placeholder="MM/YY"
                value={payment.expiry}
              />
              <Field
                autoComplete="cc-csc"
                error={errors.cvc}
                inputMode="numeric"
                label="CVC"
                maxLength={4}
                onChange={(e) => setPay("cvc", digitsOnly(e.target.value))}
                value={payment.cvc}
              />
            </div>
          </fieldset>
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <ul className="summary-items">
            {items.map((item) => (
              <li className="cart-summary-row" key={item.productId}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="cart-summary-row">
            <span>Items ({itemCount})</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}
          <Button disabled={submitting} type="submit">
            {submitting ? "Processing payment..." : `Pay ${formatCurrency(subtotal)}`}
          </Button>
          <Link className="text-link" to="/cart">
            Back to cart
          </Link>
        </aside>
      </form>
    </section>
  );
}
