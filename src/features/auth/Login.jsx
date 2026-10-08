import { Link } from "react-router-dom";

export default function Login() {
  return (
    <section className="container content-section">
      <p className="eyebrow">Welcome back</p>
      <h1 className="page-heading">Sign in</h1>
      <p className="placeholder-copy">
        Add your sign-in form and authentication flow here.
      </p>
      <Link className="text-link" to="/register">
        Create an account
      </Link>
    </section>
  );
}
