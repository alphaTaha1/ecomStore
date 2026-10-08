import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { orderId } = useParams();

  return (
    <section className="container content-section">
      <p className="eyebrow">Order information</p>
      <h1 className="page-heading">Order {orderId}</h1>
      <p className="placeholder-copy">Order status and items will appear here.</p>
    </section>
  );
}
