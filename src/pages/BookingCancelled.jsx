import { Link } from "react-router-dom";
import "./BookingStatus.css";

export default function BookingCancelled() {
  return (
    <div className="status-page">
      <div className="status-card">
        <div className="status-card__icon">↩️</div>
        <h2 className="status-card__title">Payment cancelled</h2>
        <p className="status-card__text">
          No charge was made. You can head back and try again whenever you're ready.
        </p>
        <Link to="/" className="status-btn">
          Back to fare calculator
        </Link>
      </div>
    </div>
  );
}