import { Link, useOutletContext } from "react-router-dom";
import {
  MapPin,
  Package,
  Hotel,
  MessageSquareText,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const sections = [
  {
    icon: MapPin,
    title: "Destinations",
    desc: "Create and edit destination pages used by public listing and detail views.",
    to: "/admin/destinations",
    color: "from-brand-teal/15 to-brand-teal/5",
    iconColor: "text-brand-teal"
  },
  {
    icon: Package,
    title: "Packages",
    desc: "Manage package pricing, highlights and mapped hotel connections.",
    to: "/admin/packages",
    color: "from-brand-citrus/15 to-brand-citrus/5",
    iconColor: "text-brand-citrus"
  },
  {
    icon: Hotel,
    title: "Hotels",
    desc: "Maintain hotel inventory per destination and update amenities.",
    to: "/admin/hotels",
    color: "from-brand-clay/15 to-brand-clay/5",
    iconColor: "text-brand-clay"
  },
  {
    icon: MessageSquareText,
    title: "Leads",
    desc: "View customer inquiries, filter by status, and track conversions.",
    to: "/admin/leads",
    color: "from-emerald-500/15 to-emerald-500/5",
    iconColor: "text-emerald-600"
  }
];

function AdminOverviewPage() {
  const { adminKey } = useOutletContext();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col gap-4 rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} ${item.iconColor} transition-transform group-hover:scale-110`}
              >
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-brand-charcoal/60 line-clamp-2">
                  {item.desc}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-teal opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Session card */}
      <div className="flex items-start gap-4 rounded-2xl border border-brand-charcoal/10 bg-white p-5 shadow-soft">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-brand-charcoal">
            Session Active
          </h4>
          <p className="mt-1 text-sm text-brand-charcoal/60">
            Admin key is loaded. All API requests include the{" "}
            <code className="rounded bg-brand-sand px-1.5 py-0.5 text-xs font-semibold">
              x-admin-key
            </code>{" "}
            header automatically.
          </p>
          <p className="mt-2 text-xs text-brand-charcoal/45">
            Status: {adminKey ? "✅ Configured" : "❌ Missing"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewPage;
