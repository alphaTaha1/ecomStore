import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
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
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          ShopEasy
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
          className="navbar-links"
          style={{
            display: menuOpen ? "flex" : undefined,
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>

          {user && <Link to="/cart">Cart</Link>}

          {user && <Link to="/orders">Orders</Link>}

          {user?.role === "admin" && (
            <Link to="/admin/products">Admin</Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">
                {user.email}
              </span>

              <button
                className="btn btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary">
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