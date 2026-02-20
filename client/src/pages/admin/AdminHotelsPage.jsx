import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi } from "../../lib/api";
import ImageUploadInput from "../../components/admin/ImageUploadInput";
import { Pencil, Trash2, Plus, RefreshCw, Hotel as HotelIcon, Star } from "lucide-react";

const hotelInit = {
  destination_id: "",
  name: "",
  slug: "",
  star_rating: "",
  price_per_night: "",
  summary: "",
  amenities: "",
  address: "",
  cover_image: ""
};

function parseCsv(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function AdminHotelsPage() {
  const { adminKey } = useOutletContext();
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelForm, setHotelForm] = useState(hotelInit);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const destinationOptions = useMemo(
    () => destinations.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` })),
    [destinations]
  );

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dRes, hRes] = await Promise.all([
        adminApi.listDestinations(adminKey),
        adminApi.listHotels(adminKey)
      ]);
      setDestinations(dRes.data || []);
      setHotels(hRes.data || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load hotel admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [adminKey]);

  const submitHotel = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    const payload = {
      ...hotelForm,
      destination_id: hotelForm.destination_id ? Number(hotelForm.destination_id) : null,
      star_rating: hotelForm.star_rating ? Number(hotelForm.star_rating) : null,
      price_per_night: hotelForm.price_per_night ? Number(hotelForm.price_per_night) : null,
      amenities: parseCsv(hotelForm.amenities)
    };
    try {
      if (editingHotelId) {
        await adminApi.updateHotel(adminKey, editingHotelId, payload);
        setFeedback("Hotel updated.");
      } else {
        await adminApi.createHotel(adminKey, payload);
        setFeedback("Hotel created.");
      }
      setHotelForm(hotelInit);
      setEditingHotelId(null);
      await loadData();
    } catch (submitError) {
      setError(submitError.message || "Hotel action failed.");
    }
  };

  const removeHotel = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;
    setError("");
    setFeedback("");
    try {
      await adminApi.deleteHotel(adminKey, id);
      setFeedback("Hotel deleted.");
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || "Delete failed.");
    }
  };

  const onFieldChange = (field) => (event) =>
    setHotelForm((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Form */}
      <form onSubmit={submitHotel} className="rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-bold text-brand-charcoal">
            {editingHotelId ? `Edit Hotel #${editingHotelId}` : "Create Hotel"}
          </h3>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-brand-charcoal/15 px-3 py-1.5 text-xs font-semibold text-brand-charcoal/70 transition hover:border-brand-teal hover:text-brand-teal" onClick={loadData}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Destination *</span>
            <select className="form-input" value={hotelForm.destination_id} onChange={onFieldChange("destination_id")} required>
              <option value="">Select destination</option>
              {destinationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Name *</span>
            <input className="form-input" placeholder="Hotel name" value={hotelForm.name} onChange={onFieldChange("name")} required />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Slug *</span>
            <input className="form-input" placeholder="url-slug" value={hotelForm.slug} onChange={onFieldChange("slug")} required />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Star Rating</span>
            <input className="form-input" type="number" min="1" max="7" placeholder="3" value={hotelForm.star_rating} onChange={onFieldChange("star_rating")} />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Price / Night (INR)</span>
            <input className="form-input" type="number" min="0" placeholder="4500" value={hotelForm.price_per_night} onChange={onFieldChange("price_per_night")} />
          </label>
          <ImageUploadInput
            label="Cover Image"
            value={hotelForm.cover_image}
            onChange={(img) => setHotelForm((prev) => ({ ...prev, cover_image: img }))}
            folder="hotels"
            adminKey={adminKey}
            hint="Upload hotel image."
          />
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Amenities (comma separated)</span>
            <input className="form-input" placeholder="WiFi, Pool, Spa, Restaurant" value={hotelForm.amenities} onChange={onFieldChange("amenities")} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Address</span>
            <input className="form-input" placeholder="Full address" value={hotelForm.address} onChange={onFieldChange("address")} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Summary</span>
            <textarea className="form-input min-h-24" placeholder="Describe the hotel…" value={hotelForm.summary} onChange={onFieldChange("summary")} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit">
            {editingHotelId ? <><Pencil size={14} /> Update Hotel</> : <><Plus size={14} /> Create Hotel</>}
          </button>
          {editingHotelId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingHotelId(null); setHotelForm(hotelInit); }}>
              Cancel
            </button>
          )}
        </div>

        {loading && <p className="mt-3 text-sm text-brand-charcoal/60">Loading…</p>}
        {feedback && <p className="mt-3 text-sm font-semibold text-brand-teal">{feedback}</p>}
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      </form>

      {/* List */}
      <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-soft">
        <h3 className="mb-4 font-display text-2xl font-bold text-brand-charcoal">
          Hotels ({hotels.length})
        </h3>
        {hotels.length === 0 ? (
          <p className="text-sm text-brand-charcoal/60">No hotels found. Create one from the form.</p>
        ) : (
          <div className="space-y-3">
            {hotels.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl border border-brand-charcoal/8 bg-brand-sand/30 p-3 transition-all hover:shadow-soft">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-sand text-brand-charcoal/30">
                    <HotelIcon size={20} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-brand-charcoal">{item.name}</p>
                    {item.star_rating > 0 && (
                      <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-brand-citrus">
                        {Array.from({ length: Math.min(item.star_rating, 5) }).map((_, i) => (
                          <Star key={i} size={10} className="fill-brand-citrus" />
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-charcoal/50">
                    #{item.id} · {item.destinations?.name || item.destination_id}
                    {item.price_per_night ? ` · ₹${Number(item.price_per_night).toLocaleString("en-IN")}/night` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-charcoal/15 text-brand-charcoal/60 transition hover:border-brand-teal hover:text-brand-teal" onClick={() => {
                    setEditingHotelId(item.id);
                    setHotelForm({
                      destination_id: item.destination_id ? String(item.destination_id) : "",
                      name: item.name || "",
                      slug: item.slug || "",
                      star_rating: item.star_rating ? String(item.star_rating) : "",
                      price_per_night: item.price_per_night ? String(item.price_per_night) : "",
                      summary: item.summary || "",
                      amenities: (item.amenities || []).join(", "),
                      address: item.address || "",
                      cover_image: item.cover_image || ""
                    });
                  }} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-400 transition hover:bg-red-50 hover:text-red-600" onClick={() => removeHotel(item.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHotelsPage;
