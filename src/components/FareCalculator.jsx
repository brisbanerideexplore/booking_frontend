import { useState } from "react";
import AddressAutocomplete from "./AddressAutocomplete";
import VehicleSelector from "./VehicleSelector";
import BookingForm from "./BookingForm";
import "./FareCalculator.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function FareCalculator() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [childSeat, setChildSeat] = useState(false);
  const [fareResult, setFareResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const canCalculate = pickup && destination && vehicle && !loading;

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setFareResult(null);
    setShowBooking(false);

    try {
      const res = await fetch(`${API_URL}/calculate-fare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originLat: pickup.lat,
          originLng: pickup.lng,
          destLat: destination.lat,
          destLng: destination.lng,
          vehicle,
          childSeat,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setFareResult(data);
    } catch (err) {
      setError(err.message || "Couldn't calculate the fare. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fare-calc">
      <div className="fare-calc__hero">
        <h1 className="fare-calc__title">Get your fare in seconds</h1>
        <p className="fare-calc__subtitle">
          Enter your pickup and destination for an instant, no-obligation price.
        </p>
        <div className="route-strip">
          <div className="route-strip__col">
            <div className="route-dot" />
            <span className="route-strip__label">Pickup</span>
          </div>
          <div className="route-line" />
          <div className="route-strip__col">
            <div className="route-dot route-dot--end" />
            <span className="route-strip__label">Destination</span>
          </div>
        </div>
      </div>

      <div className="fare-calc__step">
        <div className="fare-calc__step-label">
          <span className="step-number">1</span> Where from and where to
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <AddressAutocomplete
            label="Pickup address"
            placeholder="e.g. Brisbane Airport, QLD"
            onAddressSelect={setPickup}
          />
          <AddressAutocomplete
            label="Destination address"
            placeholder="e.g. Surfers Paradise, QLD"
            onAddressSelect={setDestination}
          />
        </div>
      </div>

      <div className="fare-calc__step">
        <div className="fare-calc__step-label">
          <span className="step-number">2</span> Choose your vehicle
        </div>
        <VehicleSelector selected={vehicle} onSelect={setVehicle} />
      </div>

      <div className="fare-calc__step">
        <div className="fare-calc__step-label">
          <span className="step-number">3</span> Extras
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500, fontSize: "14px" }}>
          <input
            style={{ marginTop: "20px" }}
            type="checkbox"
            checked={childSeat}
            onChange={(e) => setChildSeat(e.target.checked)}
          />
          <p style={{ marginTop: "20px", marginLeft: "10px" }}>Add child car seat (+$25)</p>
        </label>
      </div>

      <button className="fare-calc__submit" disabled={!canCalculate} onClick={handleCalculate}>
        {loading ? "Calculating..." : "Get fare"}
      </button>

      {error && <p className="fare-calc__error">{error}</p>}

      {fareResult && (
        <div className="fare-result">
          <div className="fare-result__row">
            <span>Distance</span>
            <span>{fareResult.distanceKm} km</span>
          </div>
          <div className="fare-result__row">
            <span>Estimated drive time</span>
            <span>{Math.round(fareResult.durationMin)} min</span>
          </div>
          {fareResult.childSeat && (
            <div className="fare-result__row">
              <span>Child car seat</span>
              <span>+${fareResult.childSeatFee.toFixed(2)}</span>
            </div>
          )}
          <hr className="fare-result__divider" />
          {fareResult.childSeat && (
            <div className="fare-result__row">
              <span>Child car seat</span>
              <span>+${(fareResult.childSeatFee ?? 0).toFixed(2)}</span>
            </div>
          )}
          <div className="fare-result__total">
            <span className="fare-result__total-label">Total fare</span>
            <span className="fare-result__total-amount">${fareResult.fare.toFixed(2)}</span>
          </div>

          {!showBooking && (
            <button className="fare-calc__book" onClick={() => setShowBooking(true)}>
              Book this ride
            </button>
          )}
        </div>
      )}

      {showBooking && fareResult && (
        <BookingForm
          trip={{ pickup, destination, vehicle, childSeat, fareResult }}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}