import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RateManager from "../components/admin/RateManager";
import BookingsTable from "../components/admin/BookingsTable";
import "./AdminPanel.css";
import { Helmet } from "react-helmet-async";

export default function AdminPanel() {
  const [tab, setTab] = useState("rates");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="admin-page admin-page--panel">
      <Helmet>
        <title>Admin Panel — Brizzy Ride & Explore</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="admin-topbar">
        <h1>Admin Panel</h1>
        <button className="admin-logout" onClick={logout}>Log out</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === "rates" ? "active" : ""} onClick={() => setTab("rates")}>Vehicles & Rates</button>
        <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>Bookings</button>
      </div>

      {tab === "rates" ? <RateManager /> : <BookingsTable />}
    </div>
  );
}