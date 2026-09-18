import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./BookingStatus.css";
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_ATTEMPTS = 6;
const RETRY_DELAY_MS = 1500;

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session reference.");
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const tryFetch = () => {
      attempts += 1;

      fetch(`${API_URL}/booking-by-session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;

          if (data.error) {
            // Booking not created yet — the webhook may still be
            // processing. Retry a few times before showing an error.
            if (attempts < MAX_ATTEMPTS) {
              setTimeout(tryFetch, RETRY_DELAY_MS);
            } else {
              setError(
                "We're still confirming your payment. If this doesn't update shortly, contact us with your payment confirmation."
              );
            }
          } else {
            setBooking(data);
          }
        })
        .catch(() => {
          if (!cancelled && attempts < MAX_ATTEMPTS) {
            setTimeout(tryFetch, RETRY_DELAY_MS);
          } else if (!cancelled) {
            setError("Couldn't load your booking details.");
          }
        });
    };

    tryFetch();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="status-page">
      <Helmet>
        <title>Booking Confirmed — Brizzy Ride & Explore</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="status-card">
        <div className="status-card__icon">✅</div>
        <h2 className="status-card__title">Booking confirmed!</h2>

        {!booking && !error && <p className="status-card__text">Confirming your payment...</p>}
        {error && <p className="status-error">{error}</p>}

        {booking && (
          <>
            <p className="status-card__text">
              A confirmation has been sent to {booking.email}.
            </p>
            <div className="status-summary">
              <div className="status-summary__row"><span>Pickup</span><strong>{booking.pickupAddress}</strong></div>
              <div className="status-summary__row"><span>Destination</span><strong>{booking.destinationAddress}</strong></div>
              <div className="status-summary__row"><span>Passengers</span><strong>{booking.passengers}</strong></div>
              <div className="status-summary__row"><span>Luggage</span><strong>{booking.luggage}</strong></div>
              <div className="status-summary__row"><span>Pickup date</span><strong>{booking.pickupDate}</strong></div>
              <div className="status-summary__row"><span>Pickup time</span><strong>{booking.pickupTime}</strong></div>
              <div className="status-summary__row"><span>Vehicle</span><strong>{booking.vehicle}</strong></div>
              <div className="status-summary__row"><span>Fare paid</span><strong>${booking.fare.toFixed(2)}</strong></div>
              <div className="status-summary__row"><span>Status</span><strong>{booking.paymentStatus}</strong></div>
              <div className="status-summary__row"><span>Fare paid</span><strong>${(booking.fare ?? 0).toFixed(2)}</strong></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}