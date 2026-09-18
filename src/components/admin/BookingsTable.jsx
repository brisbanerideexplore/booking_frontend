import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setBookings(data));
  }, []);

  return (
    <div className="admin-section">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th><th>Name</th><th>Passengers</th><th>Luggage</th><th>Pickup</th><th>Drop-off</th>
            <th>Pickup Date</th><th>Pickup Time</th><th>Vehicle</th><th>Payment</th><th>Fare</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{new Date(b.createdAt).toLocaleString()}</td>
              <td>{b.name}</td>
              <td>{b.passengers}</td>
              <td>{b.luggage}</td>
              <td>{b.pickupAddress}</td>
              <td>{b.destinationAddress}</td>
              <td>{b.pickupDate}</td>
              <td>{b.pickupTime}</td>
              <td>{b.vehicle}</td>
              <td>{b.paymentMethod === "cash" ? "💵 Cash" : "💳 Card"}</td>
              <td>${b.fare?.toFixed(2)}</td>
              <td>{b.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}