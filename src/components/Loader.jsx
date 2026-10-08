export default function Loader({ label = "Loading..." }) {
  return (
    <div aria-live="polite" className="loader" role="status">
      {label}
    </div>
  );
}
