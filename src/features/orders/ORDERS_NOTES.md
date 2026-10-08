# Orders & Checkout (Task 5)

**Flow:** Cart -> `/checkout` (shipping + mock card) -> `placeOrder()` -> order saved -> cart cleared -> `/orders/:id`.

**Data model:** top-level `orders/{orderId}`:
`{ userId, items[{productId,name,price,quantity,imageUrl}], subtotal, total, shipping{...}, payment{method,last4,status,transactionId}, status, createdAt }`.
Full card number and CVC are never stored. `status` starts as `processing` (admin can later set shipped/delivered/cancelled).

**Mock payment:** `4242 4242 4242 4242` approves, `4000 0000 0000 0002` declines, any other Luhn-valid card approves. No real charge.

**Prices:** at checkout each item is re-read from `products/{productId}` (uses `name`/`price`). If the product doc doesn't exist, the cart snapshot is used.

**Firestore rules to add (Person 1):**
```
match /orders/{orderId} {
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow update, delete: if false;  // admin updates via admin role later
}
```
