import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi } from "../../lib/api";
import { Search, Phone, Mail, Calendar, Users, IndianRupee, MessageSquare } from "lucide-react";

const statusStyles = {
    new: "bg-amber-100 text-amber-800",
    lost: "bg-red-100 text-red-800"
};

function formatDate(dateString) {
    if (!dateString) return "—";
    try {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    } catch {
        return dateString;
    }
}

function formatDateTime(dateString) {
    if (!dateString) return "—";
    try {
        return new Date(dateString).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return dateString;
    }
}

function AdminLeadsPage() {
    const { adminKey } = useOutletContext();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const loadLeads = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await adminApi.listLeads(adminKey);
            setLeads(response.data || []);
        } catch (loadError) {
            setError(loadError.message || "Failed to load leads.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, [adminKey]);

    const filtered = useMemo(() => {
        let result = leads;
        if (statusFilter !== "all") {
            result = result.filter((lead) => lead.status === statusFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (lead) =>
                    (lead.full_name || "").toLowerCase().includes(q) ||
                    (lead.phone || "").includes(q) ||
                    (lead.email || "").toLowerCase().includes(q)
            );
        }
        return result;
    }, [leads, statusFilter, search]);

    const statusCounts = useMemo(() => {
        const counts = { all: leads.length, new: 0, contacted: 0, converted: 0, lost: 0 };
        leads.forEach((lead) => {
            const s = lead.status || "new";
            if (counts[s] !== undefined) counts[s]++;
        });
        return counts;
    }, [leads]);

    return (
        <div className="space-y-5">
            {/* Header bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-display text-2xl font-bold text-brand-charcoal">
                        Customer Leads
                    </h3>
                    <p className="mt-1 text-sm text-brand-charcoal/60">
                        {leads.length} total inquiries received from the website
                    </p>
                </div>
                <button
                    onClick={loadLeads}
                    className="btn-secondary self-start"
                    disabled={loading}
                >
                    {loading ? "Refreshing…" : "Refresh"}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 rounded-2xl border border-brand-charcoal/10 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-charcoal/40" />
                    <input
                        className="form-input pl-9"
                        placeholder="Search by name, phone or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {["all", "new", "contacted", "converted", "lost"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all ${statusFilter === s
                                ? "bg-brand-charcoal text-white shadow-sm"
                                : "border border-brand-charcoal/15 text-brand-charcoal/70 hover:border-brand-charcoal/30"
                                }`}
                        >
                            {s} ({statusCounts[s] || 0})
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-citrus border-t-transparent" />
                </div>
            )}

            {/* Leads list */}
            {!loading && filtered.length === 0 && (
                <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-8 text-center shadow-soft">
                    <p className="text-sm text-brand-charcoal/60">
                        {leads.length === 0
                            ? "No leads yet. They will appear here as customers submit inquiries."
                            : "No leads match your current filters."}
                    </p>
                </div>
            )}

            {!loading && filtered.length > 0 && (
                <div className="space-y-3">
                    {filtered.map((lead) => (
                        <article
                            key={lead.id}
                            className="rounded-2xl border border-brand-charcoal/10 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card-hover"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-display text-lg font-bold text-brand-charcoal">
                                            {lead.full_name}
                                        </h4>
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusStyles[lead.status] || statusStyles.new}`}>
                                            {lead.status || "new"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-brand-charcoal/50">
                                        Lead #{lead.id} · {formatDateTime(lead.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex items-center gap-2 text-brand-charcoal/70">
                                    <Phone size={14} className="shrink-0 text-brand-teal" />
                                    <span>{lead.phone}</span>
                                </div>
                                {lead.email && (
                                    <div className="flex items-center gap-2 text-brand-charcoal/70">
                                        <Mail size={14} className="shrink-0 text-brand-teal" />
                                        <span>{lead.email}</span>
                                    </div>
                                )}
                                {lead.preferred_travel_date && (
                                    <div className="flex items-center gap-2 text-brand-charcoal/70">
                                        <Calendar size={14} className="shrink-0 text-brand-citrus" />
                                        <span>{formatDate(lead.preferred_travel_date)}</span>
                                    </div>
                                )}
                                {lead.travellers && (
                                    <div className="flex items-center gap-2 text-brand-charcoal/70">
                                        <Users size={14} className="shrink-0 text-brand-citrus" />
                                        <span>{lead.travellers} travellers</span>
                                    </div>
                                )}
                                {lead.budget && (
                                    <div className="flex items-center gap-2 text-brand-charcoal/70">
                                        <IndianRupee size={14} className="shrink-0 text-brand-clay" />
                                        <span>₹{Number(lead.budget).toLocaleString("en-IN")}</span>
                                    </div>
                                )}
                            </div>

                            {/* Destination / Package tags */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {lead.destinations?.name && (
                                    <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand-charcoal/80">
                                        📍 {lead.destinations.name}
                                    </span>
                                )}
                                {lead.packages?.name && (
                                    <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand-charcoal/80">
                                        📦 {lead.packages.name}
                                    </span>
                                )}
                            </div>

                            {lead.message && (
                                <div className="mt-3 flex gap-2 rounded-xl bg-brand-sand/60 p-3 text-sm text-brand-charcoal/70">
                                    <MessageSquare size={14} className="mt-0.5 shrink-0 text-brand-charcoal/40" />
                                    <p className="line-clamp-2">{lead.message}</p>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminLeadsPage;
