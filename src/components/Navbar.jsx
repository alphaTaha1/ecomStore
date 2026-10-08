import { Link, NavLink } from "react-router-dom";
import { useCart } from "../features/cart/CartContext.jsx";

const links = [
  { to: "/products", label: "Shop" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "Orders" },
  { to: "/login", label: "Sign in" },
];

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link className="brand" to="/">
          ecom<span>Store</span>
        </Link>
        <nav aria-label="Main navigation" className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
              {link.to === "/cart" && itemCount > 0 && (
                <span aria-label={`${itemCount} items in cart`} className="cart-badge">
                  {itemCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
