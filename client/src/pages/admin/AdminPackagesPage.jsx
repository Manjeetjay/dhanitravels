import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi, publicApi } from "../../lib/api";
import ImageUploadInput from "../../components/admin/ImageUploadInput";
import { Pencil, Trash2, Plus, RefreshCw, Package, Star } from "lucide-react";

const packageInit = {
  destination_id: "",
  name: "",
  slug: "",
  duration_days: "",
  price_from: "",
  summary: "",
  highlights: "",
  cover_image: "",
  is_featured: false,
  hotel_ids: ""
};

function parseCsv(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function AdminPackagesPage() {
  const { adminKey } = useOutletContext();
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [packageForm, setPackageForm] = useState(packageInit);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const destinationOptions = useMemo(
    () => destinations.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` })),
    [destinations]
  );
  const hotelOptions = useMemo(
    () => hotels.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` })),
    [hotels]
  );

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dRes, pRes, hRes] = await Promise.all([
        adminApi.listDestinations(adminKey),
        adminApi.listPackages(adminKey),
        adminApi.listHotels(adminKey)
      ]);
      setDestinations(dRes.data || []);
      setPackages(pRes.data || []);
      setHotels(hRes.data || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load package admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [adminKey]);

  const submitPackage = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    const payload = {
      ...packageForm,
      destination_id: packageForm.destination_id ? Number(packageForm.destination_id) : null,
      duration_days: packageForm.duration_days ? Number(packageForm.duration_days) : null,
      price_from: packageForm.price_from ? Number(packageForm.price_from) : null,
      highlights: parseCsv(packageForm.highlights),
      hotel_ids: parseCsv(packageForm.hotel_ids).map((i) => Number(i)).filter(Boolean)
    };
    try {
      if (editingPackageId) {
        await adminApi.updatePackage(adminKey, editingPackageId, payload);
        setFeedback("Package updated.");
      } else {
        await adminApi.createPackage(adminKey, payload);
        setFeedback("Package created.");
      }
      setPackageForm(packageInit);
      setEditingPackageId(null);
      await loadData();
    } catch (submitError) {
      setError(submitError.message || "Package action failed.");
    }
  };

  const removePackage = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    setError("");
    setFeedback("");
    try {
      await adminApi.deletePackage(adminKey, id);
      setFeedback("Package deleted.");
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || "Delete failed.");
    }
  };

  const startEditPackage = async (item) => {
    let hotelIds = "";
    try {
      const details = await publicApi.getPackageDetails(item.id);
      hotelIds = (details.data?.hotels || []).map((h) => h.id).join(", ");
    } catch { hotelIds = ""; }

    setEditingPackageId(item.id);
    setPackageForm({
      destination_id: item.destination_id ? String(item.destination_id) : "",
      name: item.name || "",
      slug: item.slug || "",
      duration_days: item.duration_days ? String(item.duration_days) : "",
      price_from: item.price_from ? String(item.price_from) : "",
      summary: item.summary || "",
      highlights: (item.highlights || []).join(", "),
      cover_image: item.cover_image || "",
      is_featured: Boolean(item.is_featured),
      hotel_ids: hotelIds
    });
  };

  const onFieldChange = (field) => (event) =>
    setPackageForm((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Form */}
      <form onSubmit={submitPackage} className="rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-bold text-brand-charcoal">
            {editingPackageId ? `Edit Package #${editingPackageId}` : "Create Package"}
          </h3>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-brand-charcoal/15 px-3 py-1.5 text-xs font-semibold text-brand-charcoal/70 transition hover:border-brand-teal hover:text-brand-teal" onClick={loadData}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Destination *</span>
            <select className="form-input" value={packageForm.destination_id} onChange={onFieldChange("destination_id")} required>
              <option value="">Select destination</option>
              {destinationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Name *</span>
            <input className="form-input" placeholder="Package name" value={packageForm.name} onChange={onFieldChange("name")} required />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Slug *</span>
            <input className="form-input" placeholder="url-slug" value={packageForm.slug} onChange={onFieldChange("slug")} required />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Duration (days)</span>
            <input className="form-input" type="number" min="1" placeholder="5" value={packageForm.duration_days} onChange={onFieldChange("duration_days")} />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Price From (INR)</span>
            <input className="form-input" type="number" min="0" placeholder="25000" value={packageForm.price_from} onChange={onFieldChange("price_from")} />
          </label>
          <ImageUploadInput
            label="Cover Image"
            value={packageForm.cover_image}
            onChange={(img) => setPackageForm((prev) => ({ ...prev, cover_image: img }))}
            folder="packages"
            adminKey={adminKey}
            hint="Upload package hero image."
          />
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Highlights (comma separated)</span>
            <input className="form-input" placeholder="Desert Safari, Camel Ride, Sunset Point" value={packageForm.highlights} onChange={onFieldChange("highlights")} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Hotel IDs (comma separated)</span>
            <input className="form-input" placeholder="1, 5, 12" value={packageForm.hotel_ids} onChange={onFieldChange("hotel_ids")} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Summary</span>
            <textarea className="form-input min-h-24" placeholder="Describe the package…" value={packageForm.summary} onChange={onFieldChange("summary")} />
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-charcoal/80">
            <input type="checkbox" className="h-4 w-4 rounded border-brand-charcoal/30 accent-brand-citrus" checked={packageForm.is_featured} onChange={(e) => setPackageForm((prev) => ({ ...prev, is_featured: e.target.checked }))} />
            Featured package
          </label>
        </div>

        <p className="mt-3 text-xs text-brand-charcoal/50">
          Available hotel IDs: {hotelOptions.map((o) => o.value).join(", ") || "Add hotels first"}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit">
            {editingPackageId ? <><Pencil size={14} /> Update Package</> : <><Plus size={14} /> Create Package</>}
          </button>
          {editingPackageId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingPackageId(null); setPackageForm(packageInit); }}>
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
          Packages ({packages.length})
        </h3>
        {packages.length === 0 ? (
          <p className="text-sm text-brand-charcoal/60">No packages found. Create one from the form.</p>
        ) : (
          <div className="space-y-3">
            {packages.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl border border-brand-charcoal/8 bg-brand-sand/30 p-3 transition-all hover:shadow-soft">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-sand text-brand-charcoal/30">
                    <Package size={20} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-brand-charcoal">{item.name}</p>
                    {item.is_featured && (
                      <span className="shrink-0 rounded-full bg-brand-citrus/20 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-citrus">
                        <Star size={10} className="mb-0.5 inline fill-brand-citrus" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-charcoal/50">
                    #{item.id} · {item.destinations?.name || item.destination_id}
                    {item.price_from ? ` · ₹${Number(item.price_from).toLocaleString("en-IN")}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-charcoal/15 text-brand-charcoal/60 transition hover:border-brand-teal hover:text-brand-teal" onClick={() => startEditPackage(item)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-400 transition hover:bg-red-50 hover:text-red-600" onClick={() => removePackage(item.id)} title="Delete">
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

export default AdminPackagesPage;
