import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../auth/firebase/services.js";
import {
  addToList,
  addToRemoteCart,
  calculateSubtotal,
  clearGuestCart,
  clearRemoteCart,
  countItems,
  loadGuestCart,
  mergeGuestCartIntoRemote,
  removeFromList,
  removeFromRemoteCart,
  saveGuestCart,
  setQuantityInList,
  setRemoteQuantity,
  subscribeToCart,
} from "./cartService.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uid = user?.uid ?? null;
  const useRemote = Boolean(uid && db);

  // Track the signed-in user (works with whatever the auth feature does).
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  // Load the right cart for the current user.
  useEffect(() => {
    if (!authReady) return undefined;
    setError(null);

    if (!useRemote) {
      setItems(loadGuestCart());
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    let unsubscribe = () => {};
    let cancelled = false;

    (async () => {
      try {
        const guestItems = loadGuestCart();
        if (guestItems.length) {
          await mergeGuestCartIntoRemote(uid, guestItems);
          clearGuestCart();
        }
      } catch (err) {
        console.error("Could not merge guest cart", err);
      }
      if (cancelled) return;
      unsubscribe = subscribeToCart(
        uid,
        (next) => {
          setItems(next);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError("We couldn't load your cart. Please try again.");
          setLoading(false);
        },
      );
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [authReady, useRemote, uid]);

  const updateGuest = useCallback((fn) => {
    setItems((prev) => {
      const next = fn(prev);
      saveGuestCart(next);
      return next;
    });
  }, []);

  const run = useCallback(async (action) => {
    setError(null);
    try {
      await action();
    } catch (err) {
      console.error(err);
      setError("Something went wrong updating your cart.");
    }
  }, []);

  const addItem = useCallback(
    (product, quantity = 1) =>
      useRemote
        ? run(() => addToRemoteCart(uid, product, quantity))
        : updateGuest((prev) => addToList(prev, product, quantity)),
    [useRemote, uid, run, updateGuest],
  );

  const updateQuantity = useCallback(
    (productId, quantity) =>
      useRemote
        ? run(() => setRemoteQuantity(uid, productId, quantity))
        : updateGuest((prev) => setQuantityInList(prev, productId, quantity)),
    [useRemote, uid, run, updateGuest],
  );

  const removeItem = useCallback(
    (productId) =>
      useRemote
        ? run(() => removeFromRemoteCart(uid, productId))
        : updateGuest((prev) => removeFromList(prev, productId)),
    [useRemote, uid, run, updateGuest],
  );

  const clearCart = useCallback(
    () =>
      useRemote
        ? run(() => clearRemoteCart(uid))
        : updateGuest(() => []),
    [useRemote, uid, run, updateGuest],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount: countItems(items),
      subtotal: calculateSubtotal(items),
      loading,
      error,
      isGuest: !useRemote,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, loading, error, useRemote, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
