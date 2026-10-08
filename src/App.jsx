import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
