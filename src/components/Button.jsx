export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variantClass = variant === "secondary" ? "button-secondary" : "";

  return (
    <button className={`button ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
