# Cart feature (Task 4)

**Data model:** `users/{uid}/cart/{productId}` -> `{ name, price, imageUrl, quantity, updatedAt }`.
Guests use localStorage; it is merged into Firestore on sign-in.

**Firebase:** the cart imports `auth`/`db` from `src/features/auth/firebase/services.js` (config.js now also exports `firebaseApp`).

**For other tasks**
- Catalog: `<AddToCartButton product={product} />` (product needs `id`, `name`, `price`, optional `imageUrl`). Already used in `ProductCard`; add it to `ProductDetails` once the product is loaded.
- Orders/Checkout: `const { items, subtotal, clearCart } = useCart()`. Re-read prices from the catalog before charging, then call `clearCart()` after the order is created. `getCartItems(uid)` is available for one-off reads.
- Auth: nothing needed; the cart listens to `onAuthStateChanged` on the shared `auth` instance.

**Firestore rules to add (Person 1):**
```
match /users/{uid}/cart/{productId} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```
