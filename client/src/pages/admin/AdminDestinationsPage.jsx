import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi } from "../../lib/api";
import ImageUploadInput from "../../components/admin/ImageUploadInput";
import { Pencil, Trash2, Plus, RefreshCw, MapPin } from "lucide-react";

const destinationInit = {
  name: "",
  slug: "",
  state: "",
  hero_image: "",
  short_description: "",
  long_description: "",
  best_time: ""
};

function AdminDestinationsPage() {
  const { adminKey } = useOutletContext();
  const [destinations, setDestinations] = useState([]);
  const [destinationForm, setDestinationForm] = useState(destinationInit);
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadDestinations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.listDestinations(adminKey);
      setDestinations(response.data || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [adminKey]);

  const submitDestination = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    try {
      if (editingDestinationId) {
        await adminApi.updateDestination(adminKey, editingDestinationId, destinationForm);
        setFeedback("Destination updated.");
      } else {
        await adminApi.createDestination(adminKey, destinationForm);
        setFeedback("Destination created.");
      }
      setDestinationForm(destinationInit);
      setEditingDestinationId(null);
      await loadDestinations();
    } catch (submitError) {
      setError(submitError.message || "Destination action failed.");
    }
  };

  const removeDestination = async (id) => {
    if (!window.confirm("Delete this destination and all related data?")) return;
    setError("");
    setFeedback("");
    try {
      await adminApi.deleteDestination(adminKey, id);
      setFeedback("Destination deleted.");
      await loadDestinations();
    } catch (deleteError) {
      setError(deleteError.message || "Delete failed.");
    }
  };

  const onFieldChange = (field) => (event) =>
    setDestinationForm((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Form */}
      <form
        onSubmit={submitDestination}
        className="rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-soft"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-bold text-brand-charcoal">
            {editingDestinationId
              ? `Edit Destination #${editingDestinationId}`
              : "Create Destination"}
          </h3>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-charcoal/15 px-3 py-1.5 text-xs font-semibold text-brand-charcoal/70 transition hover:border-brand-teal hover:text-brand-teal"
            onClick={loadDestinations}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
              Name *
            </span>
            <input className="form-input" placeholder="e.g. Goa" value={destinationForm.name} onChange={onFieldChange("name")} required />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
              Slug *
            </span>
            <input className="form-input" placeholder="e.g. goa" value={destinationForm.slug} onChange={onFieldChange("slug")} required />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
              State
            </span>
            <input className="form-input" placeholder="e.g. Maharashtra" value={destinationForm.state} onChange={onFieldChange("state")} />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
              Best Time
            </span>
            <input className="form-input" placeholder="e.g. Oct–Mar" value={destinationForm.best_time} onChange={onFieldChange("best_time")} />
          </label>
          <ImageUploadInput
            label="Hero Image"
            value={destinationForm.hero_image}
            onChange={(heroImage) => setDestinationForm((prev) => ({ ...prev, hero_image: heroImage }))}
            folder="destinations"
            adminKey={adminKey}
            hint="Upload directly to Supabase Storage or paste a URL."
          />
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
              Short Description
            </span>
            <textarea className="form-input min-h-20" placeholder="Brief intro for listing cards" value={destinationForm.short_description} onChange={onFieldChange("short_description")} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
              Long Description
            </span>
            <textarea className="form-input min-h-28" placeholder="Detailed description for the detail page" value={destinationForm.long_description} onChange={onFieldChange("long_description")} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit">
            {editingDestinationId ? (
              <><Pencil size={14} /> Update Destination</>
            ) : (
              <><Plus size={14} /> Create Destination</>
            )}
          </button>
          {editingDestinationId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingDestinationId(null); setDestinationForm(destinationInit); }}>
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
          Destinations ({destinations.length})
        </h3>
        {destinations.length === 0 ? (
          <p className="text-sm text-brand-charcoal/60">No destinations found. Create one from the form.</p>
        ) : (
          <div className="space-y-3">
            {destinations.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-brand-charcoal/8 bg-brand-sand/30 p-3 transition-all hover:shadow-soft"
              >
                {item.hero_image ? (
                  <img src={item.hero_image} alt={item.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-sand text-brand-charcoal/30">
                    <MapPin size={20} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-brand-charcoal">{item.name}</p>
                  <p className="text-xs text-brand-charcoal/50">
                    #{item.id} · {item.slug} {item.state ? ` · ${item.state}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-charcoal/15 text-brand-charcoal/60 transition hover:border-brand-teal hover:text-brand-teal"
                    onClick={() => {
                      setEditingDestinationId(item.id);
                      setDestinationForm({
                        name: item.name || "",
                        slug: item.slug || "",
                        state: item.state || "",
                        hero_image: item.hero_image || "",
                        short_description: item.short_description || "",
                        long_description: item.long_description || "",
                        best_time: item.best_time || ""
                      });
                    }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeDestination(item.id)}
                    title="Delete"
                  >
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

export default AdminDestinationsPage;
