import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import { Helmet } from "react-helmet-async";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Helmet>
        <title>Admin Login — Brizzy Ride & Explore</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form className="admin-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="admin-error">{error}</p>}
        <button className="admincard-btn" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
      </form>
    </div>
  );
}