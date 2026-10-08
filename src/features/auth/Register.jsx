import { Link } from "react-router-dom";

export default function Register() {
  return (
    <section className="container content-section">
      <p className="eyebrow">Join our community</p>
      <h1 className="page-heading">Create an account</h1>
      <p className="placeholder-copy">
        Add your registration form and authentication flow here.
      </p>
      <Link className="text-link" to="/login">
        Already have an account? Sign in
      </Link>
    </section>
  );
}
