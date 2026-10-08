import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { auth } from "../features/auth/firebase/config";
import { logoutUser } from "../features/auth/authService";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav aria-label="Main navigation" className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ShopEasy
        </Link>

        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          ☰
        </button>

        <div
          className={`navbar-links${menuOpen ? " is-open" : ""}`}
          id="primary-navigation"
        >
          <NavLink
            end
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>

          {user && (
            <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </NavLink>
          )}

          {user && (
            <NavLink to="/orders" onClick={() => setMenuOpen(false)}>
              Orders
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin/products"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">{user.email}</span>

              <button
                className="btn btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-outline"
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                className="btn btn-primary"
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;