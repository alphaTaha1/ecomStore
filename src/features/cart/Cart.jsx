import { Link } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Loader from "../../components/Loader.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import { MAX_QUANTITY } from "./cartService.js";
import { useCart } from "./CartContext.jsx";

export default function Cart() {
  const {
    items,
    subtotal,
    itemCount,
    loading,
    error,
    isGuest,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (loading) return <Loader label="Loading your cart..." />;

  return (
    <section className="container content-section">
      <p className="eyebrow">Your selections</p>
      <h1 className="page-heading">Shopping cart</h1>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <h2 className="section-heading">Your cart is empty</h2>
          <p className="placeholder-copy">
            Browse the collection and add something you love.
          </p>
          <Link className="button" to="/products">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {items.map((item) => (
              <li className="cart-item" key={item.productId}>
                <div
                  aria-label={item.name}
                  className="cart-item-image"
                  role="img"
                  style={
                    item.imageUrl
                      ? { backgroundImage: `url(${item.imageUrl})` }
                      : undefined
                  }
                />
                <div className="cart-item-info">
                  <Link className="cart-item-name" to={`/products/${item.productId}`}>
                    {item.name}
                  </Link>
                  <span className="price">{formatCurrency(item.price)}</span>
                </div>
                <div className="quantity-control">
                  <button
                    aria-label={`Decrease quantity of ${item.name}`}
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    type="button"
                  >
                    −
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    aria-label={`Increase quantity of ${item.name}`}
                    disabled={item.quantity >= MAX_QUANTITY}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <strong className="cart-item-total">
                  {formatCurrency(item.price * item.quantity)}
                </strong>
                <button
                  aria-label={`Remove ${item.name} from cart`}
                  className="cart-remove"
                  onClick={() => removeItem(item.productId)}
                  type="button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row">
              <span>Items ({itemCount})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {isGuest && (
              <p className="placeholder-copy">
                <Link className="text-link" to="/login">
                  Sign in
                </Link>{" "}
                to keep your cart across devices.
              </p>
            )}
            <Link className="button" to="/checkout">
              Proceed to checkout
            </Link>
            <Button onClick={clearCart} type="button" variant="secondary">
              Clear cart
            </Button>
          </aside>
        </div>
      )}
    </section>
  );
}
