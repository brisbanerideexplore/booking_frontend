import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingForm.css";

const API_URL = import.meta.env.VITE_API_URL;

const COUNTRY_CODES = [
  { code: "+61", label: "🇦🇺 +61 Australia" },
  { code: "+64", label: "🇳🇿 +64 New Zealand" },
  { code: "+1", label: "🇺🇸 +1 US/Canada" },
  { code: "+44", label: "🇬🇧 +44 UK" },
  { code: "+91", label: "🇮🇳 +91 India" },
];

export default function BookingForm({ trip, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+61");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passengers, setPassengers] = useState("1");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [luggage, setLuggage] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  const canSubmit = name.trim() && email.trim() && phone.trim() && passengers && pickupDate && pickupTime && !loading;

  const buildPayload = () => ({
    name,
    email,
    phone: `${countryCode}${phone.replace(/^0+/, "")}`,
    passengers: Number(passengers),
    luggage: Number(luggage),
    pickupDate,
    pickupTime,
    pickupAddress: trip.pickup.address,
    pickupLat: trip.pickup.lat,
    pickupLng: trip.pickup.lng,
    destinationAddress: trip.destination.address,
    destLat: trip.destination.lat,
    destLng: trip.destination.lng,
    vehicle: trip.vehicle,
    distanceKm: trip.fareResult.distanceKm,
    durationMin: trip.fareResult.durationMin,
    fare: trip.fareResult.fare,
    childSeat: trip.childSeat,
    childSeatFee: trip.fareResult.childSeatFee,
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === "card") {
        const res = await fetch(`${API_URL}/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't start checkout.");
        window.location.href = data.url;
      } else {
        const res = await fetch(`${API_URL}/book-cash`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't book the ride.");
        navigate(`/booking-success?session_id=${data.sessionId}`);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h2 className="booking-form__title">Your details</h2>

      <label>Full name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />

      <label>Phone number</label>
      <div className="booking-form__phone-row">
        <select className="booking-form__country-code" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="412 345 678"
        />
      </div>

      <label>No. of passengers</label>
      <input type="number" min="1" value={passengers} onChange={(e) => setPassengers(e.target.value)} placeholder="1" />

      <label>No. of luggage</label>
      <input type="number" min="0" value={luggage} onChange={(e) => setLuggage(e.target.value)} placeholder="0" />

      <label>Pickup date</label>
      <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />

      <label>Pickup time</label>
      <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />

      <label>Payment method</label>
      <div className="booking-form__payment-row">
        <button
          type="button"
          className={`booking-form__payment-option${paymentMethod === "card" ? " booking-form__payment-option--selected" : ""}`}
          onClick={() => setPaymentMethod("card")}
          disabled={loading}
        >
          💳 Card
        </button>
        <button
          type="button"
          className={`booking-form__payment-option${paymentMethod === "cash" ? " booking-form__payment-option--selected" : ""}`}
          onClick={() => setPaymentMethod("cash")}
          disabled={loading}
        >
          💵 Cash
        </button>
      </div>

      {error && <p className="booking-form__error">{error}</p>}

      <button className="booking-form__submit" disabled={!canSubmit} onClick={handleSubmit}>
        {loading
          ? (paymentMethod === "card" ? "Redirecting to payment..." : "Booking your ride...")
          : (paymentMethod === "card" ? "Proceed to payment" : "Confirm cash booking")}
      </button>
      <button className="booking-form__cancel" onClick={onClose} disabled={loading}>
        Cancel
      </button>
    </div>
  );
}