import { useState, useRef } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function generateSessionToken() {
  return crypto.randomUUID();
}

export default function AddressAutocomplete({ label, placeholder, onAddressSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const sessionToken = useRef(generateSessionToken());
  const debounceTimer = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceTimer.current);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(value)}&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken.current}&country=au`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    }, 300);
  };

  const handleSelect = async (suggestion) => {
    setQuery(suggestion.full_address);
    setSuggestions([]);

    const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?access_token=${MAPBOX_TOKEN}&session_token=${sessionToken.current}`;
    const res = await fetch(url);
    const data = await res.json();
    const [lng, lat] = data.features[0].geometry.coordinates;

    onAddressSelect({ address: suggestion.full_address, lat, lng });
    sessionToken.current = generateSessionToken();
  };

  return (
    <div className="address-field">
      <label>{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="address-suggestions">
          {suggestions.map((s) => (
            <li key={s.mapbox_id} onClick={() => handleSelect(s)}>
              {s.full_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}