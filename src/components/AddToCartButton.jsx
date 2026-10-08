import { useEffect, useState } from "react";
import { useCart } from "../features/cart/CartContext.jsx";
import Button from "./Button.jsx";

export default function AddToCartButton({ product, quantity = 1, className = "" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  async function handleClick() {
    await addItem(product, quantity);
    setAdded(true);
  }

  return (
    <Button className={className} onClick={handleClick} type="button">
      {added ? "Added ✓" : "Add to cart"}
    </Button>
  );
}
