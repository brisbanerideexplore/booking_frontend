import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import "../App.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <a href="/" className="site-header__brand">
          <div className="site-header__logo-badge">
            <img src={logo} alt="Company logo" />
          </div>
          <div className="site-header__wordmark">
            YourBrand
            <span>Airport transfers</span>
          </div>
        </a>
        <nav className="site-header__nav">
          <a href="/admin-login">Admin</a>
        </nav>
      </div>
    </header>
  );
}