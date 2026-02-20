import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Hotel,
  MessageSquareText,
  LogOut,
  Lock,
  ArrowRight,
  Settings,
  Loader2,
  AlertCircle
} from "lucide-react";
import { adminApi } from "../../lib/api";

const storageKey = "dhani_admin_key";

const navItems = [
  { to: "/admin", label: "Overview", end: true, icon: LayoutDashboard },
  { to: "/admin/destinations", label: "Destinations", icon: MapPin },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/hotels", label: "Hotels", icon: Hotel },
  { to: "/admin/leads", label: "Leads", icon: MessageSquareText },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];

function AdminShell() {
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminKey, setAdminKey] = useState(
    () => localStorage.getItem(storageKey) || ""
  );
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Verify stored key on mount
  useEffect(() => {
    if (!adminKey) {
      setVerified(false);
      return;
    }

    let cancelled = false;

    const verify = async () => {
      setVerifying(true);
      setLoginError("");
      try {
        await adminApi.verifyAdminKey(adminKey);
        if (!cancelled) setVerified(true);
      } catch {
        // Invalid stored key — clear it
        if (!cancelled) {
          localStorage.removeItem(storageKey);
          setAdminKey("");
          setVerified(false);
          setLoginError("Session expired. Please log in again.");
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [adminKey]);

  const onLogin = async (event) => {
    event.preventDefault();
    const key = adminKeyInput.trim();
    if (!key) return;

    setVerifying(true);
    setLoginError("");

    try {
      await adminApi.verifyAdminKey(key);
      localStorage.setItem(storageKey, key);
      setAdminKey(key);
      setVerified(true);
    } catch {
      setLoginError("Invalid admin key. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem(storageKey);
    setAdminKey("");
    setVerified(false);
    setAdminKeyInput("");
    setLoginError("");
  };

  /* ── Loading state ─────────────────────── */
  if (verifying && !verified) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-brand-charcoal/50">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm font-medium">Verifying access...</span>
        </div>
      </div>
    );
  }

  /* ── Login screen ────────────────────── */
  if (!adminKey || !verified) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-brand-charcoal/10 bg-white p-8 shadow-card-hover sm:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-citrus/20 to-brand-gold/10 text-brand-clay">
              <Lock size={26} />
            </div>
            <h2 className="font-display text-3xl font-bold text-brand-charcoal">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-brand-charcoal/60">
              Enter your admin key to manage website content, leads, and
              settings.
            </p>
            <div className="gold-line mt-4" />

            {loginError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <AlertCircle size={16} className="shrink-0" />
                {loginError}
              </div>
            )}

            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                  Admin Key
                </span>
                <input
                  type="password"
                  className="form-input"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  placeholder="Enter your secret key"
                  required
                  disabled={verifying}
                />
              </label>
              <button
                type="submit"
                className="btn-gold w-full rounded-xl disabled:opacity-50"
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Unlock Panel
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── Authenticated shell ─────────────── */
  return (
    <div className="section-shell space-y-6 py-8">
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-brand-charcoal/60">
            Manage destinations, packages, hotels & customer leads.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Navigation tabs */}
      <nav className="flex flex-wrap gap-2 rounded-2xl border border-brand-charcoal/10 bg-white p-2 shadow-soft">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                  ? "bg-brand-charcoal text-white shadow-sm"
                  : "text-brand-charcoal/70 hover:bg-brand-sand hover:text-brand-charcoal"
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Page content */}
      <Outlet context={{ adminKey }} />
    </div>
  );
}

export default AdminShell;
