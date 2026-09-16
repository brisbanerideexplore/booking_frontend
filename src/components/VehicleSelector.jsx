import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function CarIcon() { /* keep exactly as-is */ }

export default function VehicleSelector({ selected, onSelect }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setVehicles(data));
  }, []);

  return (
    <div className="vehicle-grid">
      {vehicles.map((v) => (
        <button
          key={v._id}
          type="button"
          className={`vehicle-card${selected === v.vehicle ? " vehicle-card--selected" : ""}`}
          onClick={() => onSelect(v.vehicle)}
        >
          <div className="vehicle-card__icon"><CarIcon /></div>
          <div className="vehicle-card__name">{v.vehicle}</div>
          <div className="vehicle-card__tagline">{v.tagline}</div>
        </button>
      ))}
    </div>
  );
}