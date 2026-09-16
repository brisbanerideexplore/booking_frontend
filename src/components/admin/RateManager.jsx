import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

const emptyForm = { vehicle: "", tagline: "", baseFare: "", perKm: "", perMin: "", minFare: "" };

export default function RateManager() {
  const [rates, setRates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    const res = await fetch(`${API_URL}/admin/rates`, { headers: authHeaders() });
    const data = await res.json();
    if (res.ok) setRates(data);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (rate) => {
    setEditingId(rate._id);
    setForm({
      vehicle: rate.vehicle, tagline: rate.tagline || "",
      baseFare: rate.baseFare, perKm: rate.perKm, perMin: rate.perMin, minFare: rate.minFare || 0,
    });
  };

  const resetForm = () => { setEditingId(null); setForm(emptyForm); setError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      vehicle: form.vehicle, tagline: form.tagline,
      baseFare: Number(form.baseFare), perKm: Number(form.perKm),
      perMin: Number(form.perMin), minFare: Number(form.minFare || 0),
    };

    const url = editingId ? `${API_URL}/admin/rates/${editingId}` : `${API_URL}/admin/rates`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to save.");

    resetForm();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this vehicle? This cannot be undone.")) return;
    await fetch(`${API_URL}/admin/rates/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
  };

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit vehicle" : "Add new vehicle"}</h3>
        <input placeholder="Vehicle name" value={form.vehicle}
          onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
          disabled={!!editingId} required />
        <input placeholder="Tagline (optional)" value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        <div className="admin-form__row">
          <input type="number" step="0.01" placeholder="Base fare" value={form.baseFare}
            onChange={(e) => setForm({ ...form, baseFare: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Per km" value={form.perKm}
            onChange={(e) => setForm({ ...form, perKm: e.target.value })} required />
        </div>
        <div className="admin-form__row">
          <input type="number" step="0.01" placeholder="Per min" value={form.perMin}
            onChange={(e) => setForm({ ...form, perMin: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Minimum fare" value={form.minFare}
            onChange={(e) => setForm({ ...form, minFare: e.target.value })} />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form__actions">
          <button type="submit">{editingId ? "Save changes" : "Add vehicle"}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr><th>Vehicle</th><th>Base</th><th>Per km</th><th>Per min</th><th>Min fare</th><th></th></tr>
        </thead>
        <tbody>
          {rates.map((r) => (
            <tr key={r._id}>
              <td>{r.vehicle}</td>
              <td>${r.baseFare}</td>
              <td>${r.perKm}</td>
              <td>${r.perMin}</td>
              <td>${r.minFare || 0}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}