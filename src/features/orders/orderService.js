import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../auth/firebase/services.js";
import { digitsOnly } from "./orderValidation.js";

/**
 * Order data model: top-level `orders/{orderId}`
 *   { userId, items: [{productId, name, price, quantity, imageUrl}],
 *     subtotal, total, shipping: {...},
 *     payment: { method, last4, status, transactionId },
 *     status, createdAt }
 * The full card number / CVC is NEVER stored.
 */

export const ORDER_STATUS_LABELS = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function shortOrderId(id) {
  return String(id).slice(0, 8).toUpperCase();
}

export function toDate(timestamp) {
  if (!timestamp) return null;
  return typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
}

/**
 * Mock payment gateway. No money moves.
 *   4242 4242 4242 4242 -> approved
 *   4000 0000 0000 0002 -> declined
 *   any other valid card -> approved
 */
export async function mockPayment({ cardNumber, amount }) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const digits = digitsOnly(cardNumber);
  if (digits === "4000000000000002") {
    throw new Error("Your card was declined. Try a different card.");
  }
  return {
    method: "mock-card",
    last4: digits.slice(-4),
    status: "paid",
    amount,
    transactionId: `mock_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
  };
}

/**
 * Use the catalog's current name/price when the product exists, so a stale
 * cart can't be used to buy at an old price. Falls back to the cart snapshot
 * if the product isn't in the catalog (e.g. catalog not wired up yet).
 */
export async function priceCartItems(cartItems) {
  return Promise.all(
    cartItems.map(async (item) => {
      try {
        const snap = await getDoc(doc(db, "products", item.productId));
        if (snap.exists()) {
          const product = snap.data();
          return {
            productId: item.productId,
            name: product.name ?? item.name,
            price: Number(product.price) || item.price,
            imageUrl: product.imageUrl ?? item.imageUrl ?? "",
            quantity: item.quantity,
          };
        }
      } catch (err) {
        console.warn("Could not verify price for", item.productId, err);
      }
      return { ...item };
    }),
  );
}

export async function placeOrder({ uid, cartItems, shipping, payment }) {
  if (!uid) throw new Error("You must be signed in to place an order.");
  if (!cartItems.length) throw new Error("Your cart is empty.");

  const items = await priceCartItems(cartItems);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal; // free shipping, no tax in this demo

  const receipt = await mockPayment({ cardNumber: payment.cardNumber, amount: total });

  const orderRef = await addDoc(collection(db, "orders"), {
    userId: uid,
    items,
    subtotal,
    total,
    shipping,
    payment: {
      method: receipt.method,
      last4: receipt.last4,
      status: receipt.status,
      transactionId: receipt.transactionId,
    },
    status: "processing",
    createdAt: serverTimestamp(),
  });
  return orderRef.id;
}

export async function getUserOrders(uid) {
  const snap = await getDocs(query(collection(db, "orders"), where("userId", "==", uid)));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (toDate(b.createdAt)?.getTime() ?? 0) - (toDate(a.createdAt)?.getTime() ?? 0));
}

export async function getOrder(orderId, uid) {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  const order = { id: snap.id, ...snap.data() };
  return order.userId === uid ? order : null;
}
