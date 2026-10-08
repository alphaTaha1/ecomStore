// Pure helpers (no Firebase) so they are easy to test.

export const SHIPPING_FIELDS = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "phone", label: "Phone", autoComplete: "tel" },
  { name: "address", label: "Street address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code" },
  { name: "country", label: "Country", autoComplete: "country-name" },
];

export function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function formatCardNumber(value) {
  return digitsOnly(value).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value) {
  const d = digitsOnly(value).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function passesLuhn(number) {
  const digits = digitsOnly(number);
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export function validateShipping(shipping) {
  const errors = {};
  SHIPPING_FIELDS.forEach(({ name, label }) => {
    if (!String(shipping[name] ?? "").trim()) errors[name] = `${label} is required`;
  });
  return errors;
}

export function validatePayment(payment, now = new Date()) {
  const errors = {};
  if (!String(payment.cardName ?? "").trim()) errors.cardName = "Name on card is required";
  if (!passesLuhn(payment.cardNumber)) errors.cardNumber = "Enter a valid card number";

  const match = /^(\d{2})\/(\d{2})$/.exec(payment.expiry ?? "");
  if (!match) {
    errors.expiry = "Use MM/YY";
  } else {
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    if (month < 1 || month > 12) errors.expiry = "Invalid month";
    else if (endOfMonth < now) errors.expiry = "Card has expired";
  }

  if (!/^\d{3,4}$/.test(payment.cvc ?? "")) errors.cvc = "Enter 3 or 4 digits";
  return errors;
}
