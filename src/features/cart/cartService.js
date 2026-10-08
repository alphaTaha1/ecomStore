import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../auth/firebase/services.js";

/**
 * Cart data model
 * ----------------
 * Signed-in users: Firestore  users/{uid}/cart/{productId}
 * Guests:          localStorage (merged into Firestore on sign-in)
 *
 * Cart item shape (a snapshot of the product at the time it was added):
 *   { productId, name, price, imageUrl, quantity }
 *
 * Price/name are stored for display only. Checkout (orders feature) must
 * re-read the product from the catalog before charging.
 */

export const MAX_QUANTITY = 99;
const GUEST_CART_KEY = "ecomStore.guestCart";

/* ---------- pure helpers (shared by guest + signed-in flows) ---------- */

export function clampQuantity(quantity) {
  const n = Math.floor(Number(quantity));
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, n));
}

export function toCartItem(product, quantity = 1) {
  return {
    productId: String(product.id ?? product.productId),
    name: product.name ?? "Untitled product",
    price: Number(product.price) || 0,
    imageUrl: product.imageUrl ?? product.image ?? "",
    quantity: clampQuantity(quantity),
  };
}

export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function countItems(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToList(items, product, quantity = 1) {
  const incoming = toCartItem(product, quantity);
  const existing = items.find((i) => i.productId === incoming.productId);
  if (!existing) return [...items, incoming];
  return items.map((i) =>
    i.productId === incoming.productId
      ? { ...i, quantity: clampQuantity(i.quantity + incoming.quantity) }
      : i,
  );
}

export function setQuantityInList(items, productId, quantity) {
  return items.map((i) =>
    i.productId === productId ? { ...i, quantity: clampQuantity(quantity) } : i,
  );
}

export function removeFromList(items, productId) {
  return items.filter((i) => i.productId !== productId);
}

/* ---------- guest cart (localStorage) ---------- */

export function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private mode / quota) - cart stays in memory only
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // ignore
  }
}

/* ---------- signed-in cart (Firestore) ---------- */

const cartCollection = (uid) => collection(db, "users", uid, "cart");
const cartDoc = (uid, productId) => doc(db, "users", uid, "cart", productId);

function snapshotToItems(snapshot) {
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      productId: d.id,
      name: data.name,
      price: Number(data.price) || 0,
      imageUrl: data.imageUrl ?? "",
      quantity: clampQuantity(data.quantity),
    };
  });
}

/** Live-subscribe to a user's cart. Returns the unsubscribe function. */
export function subscribeToCart(uid, onItems, onError) {
  return onSnapshot(
    cartCollection(uid),
    (snapshot) => onItems(snapshotToItems(snapshot)),
    onError,
  );
}

/** One-off read (useful for checkout). */
export async function getCartItems(uid) {
  return snapshotToItems(await getDocs(cartCollection(uid)));
}

export async function addToRemoteCart(uid, product, quantity = 1) {
  const item = toCartItem(product, quantity);
  await setDoc(
    cartDoc(uid, item.productId),
    {
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: increment(item.quantity),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function setRemoteQuantity(uid, productId, quantity) {
  await updateDoc(cartDoc(uid, productId), {
    quantity: clampQuantity(quantity),
    updatedAt: serverTimestamp(),
  });
}

export async function removeFromRemoteCart(uid, productId) {
  await deleteDoc(cartDoc(uid, productId));
}

export async function clearRemoteCart(uid) {
  const snapshot = await getDocs(cartCollection(uid));
  if (snapshot.empty) return;
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

/** Move a guest cart into the user's Firestore cart (quantities add up). */
export async function mergeGuestCartIntoRemote(uid, guestItems) {
  if (!guestItems.length) return;
  const batch = writeBatch(db);
  guestItems.forEach((raw) => {
    const item = toCartItem({ ...raw, id: raw.productId }, raw.quantity);
    batch.set(
      cartDoc(uid, item.productId),
      {
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: increment(item.quantity),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
}
