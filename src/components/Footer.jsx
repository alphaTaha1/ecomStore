function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <strong>ShopEasy</strong>
          <p>Simple. Fast. Reliable shopping.</p>
        </div>

        <p>
          © {new Date().getFullYear()} ShopEasy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;