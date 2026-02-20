import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi, publicApi } from "../../lib/api";
import ImageUploadInput from "../../components/admin/ImageUploadInput";
import { Save, RefreshCw } from "lucide-react";

function AdminSettingsPage() {
    const { adminKey } = useOutletContext();
    const [settings, setSettings] = useState({
        agency_name: "",
        logo_url: "",
        contact_phone: "",
        whatsapp_number: "",
        support_email: "",
        address: "",
        instagram_url: "",
        facebook_url: "",
        twitter_url: "",
        youtube_url: ""
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");

    const loadSettings = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await publicApi.getSettings();
            if (response.data) {
                setSettings((prev) => ({ ...prev, ...response.data }));
            }
        } catch (err) {
            setError("Failed to load settings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, [adminKey]);

    const saveSettings = async (e) => {
        e.preventDefault();
        console.log("Submitting settings payload:", settings);
        setSaving(true);
        setFeedback("");
        setError("");
        try {
            await adminApi.updateSettings(adminKey, settings);
            setFeedback("Settings saved successfully.");
            // Reload to ensure state is in sync
            await loadSettings();
        } catch (err) {
            setError(err.message || "Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field) => (e) => {
        console.log(`Field changed: ${field} = ${e.target.value}`);
        setSettings((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="max-w-4xl">
            <form
                onSubmit={saveSettings}
                className="rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-soft"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-display text-2xl font-bold text-brand-charcoal">
                            Agency Settings
                        </h3>
                        <p className="text-sm text-brand-charcoal/60">
                            Manage global website details, contact info, and branding.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={loadSettings}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-charcoal/15 px-3 py-1.5 text-xs font-semibold text-brand-charcoal/70 transition hover:border-brand-teal hover:text-brand-teal"
                    >
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Branding */}
                    <div className="space-y-4 md:col-span-2">
                        <h4 className="border-b border-brand-charcoal/10 pb-2 font-display text-lg font-bold text-brand-charcoal">
                            Branding
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Agency Name
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.agency_name}
                                    onChange={handleChange("agency_name")}
                                    placeholder="Dhani Travels"
                                />
                            </label>
                            <ImageUploadInput
                                label="Logo URL"
                                value={settings.logo_url}
                                onChange={(url) => setSettings((prev) => ({ ...prev, logo_url: url }))}
                                folder="branding"
                                adminKey={adminKey}
                                hint="Website logo (recommended height: 40px)"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 md:col-span-2">
                        <h4 className="border-b border-brand-charcoal/10 pb-2 font-display text-lg font-bold text-brand-charcoal">
                            Contact Information
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Display Phone
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.contact_phone}
                                    onChange={handleChange("contact_phone")}
                                    placeholder="+91 98765 43210"
                                />
                            </label>
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    WhatsApp Number (No + or spaces)
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.whatsapp_number}
                                    onChange={handleChange("whatsapp_number")}
                                    placeholder="919876543210"
                                />
                            </label>
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Support Email
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.support_email}
                                    onChange={handleChange("support_email")}
                                    placeholder="hello@example.com"
                                />
                            </label>
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Full Address
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.address}
                                    onChange={handleChange("address")}
                                    placeholder="123 Street, City, Country"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4 md:col-span-2">
                        <h4 className="border-b border-brand-charcoal/10 pb-2 font-display text-lg font-bold text-brand-charcoal">
                            Social Media Links
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Instagram URL
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.instagram_url}
                                    onChange={handleChange("instagram_url")}
                                    placeholder="https://instagram.com/..."
                                />
                            </label>
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Facebook URL
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.facebook_url}
                                    onChange={handleChange("facebook_url")}
                                    placeholder="https://facebook.com/..."
                                />
                            </label>
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    Twitter / X URL
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.twitter_url}
                                    onChange={handleChange("twitter_url")}
                                    placeholder="https://twitter.com/..."
                                />
                            </label>
                            <label>
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                                    YouTube URL
                                </span>
                                <input
                                    className="form-input"
                                    value={settings.youtube_url}
                                    onChange={handleChange("youtube_url")}
                                    placeholder="https://youtube.com/..."
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary min-w-[140px]"
                    >
                        {saving ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save size={16} /> Save Changes
                            </>
                        )}
                    </button>
                    {feedback && <p className="text-sm font-semibold text-brand-teal">{feedback}</p>}
                    {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
                </div>
            </form>
        </div>
    );
}

export default AdminSettingsPage;
