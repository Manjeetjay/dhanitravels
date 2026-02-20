import { useMemo, useState } from "react";
import { publicApi } from "../lib/api";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useAgency } from "../context/AgencyContext";

const initialForm = {
  full_name: "",
  phone: "",
  email: "",
  preferred_travel_date: "",
  travellers: "",
  budget: "",
  destination_id: "",
  package_id: "",
  message: ""
};

function LeadForm({
  title = "Plan your trip",
  subtitle = "Tell us what you need and we will take your request straight to WhatsApp.",
  presetDestinationId = "",
  presetPackageId = "",
  destinations = [],
  packages = []
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    destination_id: presetDestinationId ? String(presetDestinationId) : "",
    package_id: presetPackageId ? String(presetPackageId) : ""
  }));
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const packageOptions = useMemo(() => {
    if (!form.destination_id) {
      return packages;
    }
    return packages.filter(
      (item) => String(item.destination_id) === String(form.destination_id)
    );
  }, [form.destination_id, packages]);

  const isDestinationLocked = Boolean(presetDestinationId);
  const isPackageLocked = Boolean(presetPackageId);
  const hasDestinations = destinations.length > 0;
  const hasPackages = packageOptions.length > 0;

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "destination_id" && !isPackageLocked
        ? { package_id: "" }
        : {})
    }));
  };

  const { agency } = useAgency();

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const text = "Hi, I'm interested in planning a trip. Can you help me?";
    window.open(`https://wa.me/${agency.whatsapp_number}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");
    setError("");

    try {
      const payload = {
        ...form,
        travellers: form.travellers ? Number(form.travellers) : null,
        budget: form.budget ? Number(form.budget) : null,
        destination_id: form.destination_id
          ? Number(form.destination_id)
          : null,
        package_id: form.package_id ? Number(form.package_id) : null
      };

      const response = await publicApi.submitLead(payload);
      const whatsappUrl = response?.data?.whatsapp_url;

      setFeedback("Inquiry saved. Opening WhatsApp now.");
      if (whatsappUrl) {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setForm((prev) => ({
        ...initialForm,
        destination_id: isDestinationLocked ? prev.destination_id : "",
        package_id: isPackageLocked ? prev.package_id : ""
      }));
    } catch (submitError) {
      setError(submitError.message || "Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-brand-charcoal/8 bg-white/95 p-6 shadow-soft backdrop-blur-sm sm:p-8">
      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold text-brand-charcoal">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-brand-charcoal/65">{subtitle}</p>
        <div className="gold-line mt-3" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Full Name *
          </span>
          <input
            className="form-input"
            name="full_name"
            value={form.full_name}
            onChange={onChange}
            placeholder="Your full name"
            required
          />
        </label>
        <label className="sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Phone *
          </span>
          <input
            className="form-input"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+91 98765 43210"
            required
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Email
          </span>
          <input
            className="form-input"
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Travel Date
          </span>
          <input
            className="form-input"
            name="preferred_travel_date"
            value={form.preferred_travel_date}
            onChange={onChange}
            type="date"
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Travellers
          </span>
          <input
            className="form-input"
            name="travellers"
            value={form.travellers}
            onChange={onChange}
            type="number"
            min="1"
            placeholder="2"
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Budget (INR)
          </span>
          <input
            className="form-input"
            name="budget"
            value={form.budget}
            onChange={onChange}
            type="number"
            min="0"
            placeholder="50,000"
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Destination
          </span>
          <select
            className="form-input"
            name="destination_id"
            value={form.destination_id}
            onChange={onChange}
            disabled={isDestinationLocked || !hasDestinations}
          >
            <option value="">
              {hasDestinations
                ? "Select destination"
                : "No destinations available"}
            </option>
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Package
          </span>
          <select
            className="form-input"
            name="package_id"
            value={form.package_id}
            onChange={onChange}
            disabled={isPackageLocked || !hasPackages}
          >
            <option value="">
              {hasPackages ? "Select package" : "No packages available"}
            </option>
            {packageOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
            Message
          </span>
          <textarea
            className="form-input min-h-24"
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder="Share preferred cities, hotel style, or any special request."
          />
        </label>
        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            className="btn-gold rounded-xl disabled:opacity-50 disabled:hover:scale-100"
            disabled={submitting}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                Send Inquiry
                <Send size={16} />
              </>
            )}
          </button>
          {feedback ? (
            <p className="text-sm font-semibold text-brand-teal">{feedback}</p>
          ) : null}
          {error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          ) : null}
        </div>
        {!hasDestinations && !isDestinationLocked ? (
          <p className="text-xs text-brand-charcoal/55 sm:col-span-2">
            Destinations are empty right now. You can still submit a general
            inquiry.
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default LeadForm;
