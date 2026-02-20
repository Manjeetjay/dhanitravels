import { NavLink, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  ArrowRight
} from "lucide-react";
import { useAgency } from "../context/AgencyContext";

const navItems = [
  { path: "/destinations", label: "Destinations" },
  { path: "/packages", label: "Packages" },
  { path: "/hotels", label: "Hotels" },
  { path: "/about", label: "About" }
];

function Navbar() {
  const { agency } = useAgency();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setHidden(latest > previous && latest > 150);
    setScrolled(latest > 50);
  });

  const navBg = scrolled
    ? "bg-white/90 shadow-lg shadow-brand-charcoal/5 border-white/40"
    : isHome
      ? "bg-white/10 border-white/10"
      : "bg-white/70 border-white/20";

  const textColor = scrolled
    ? "text-brand-charcoal"
    : isHome
      ? "text-white"
      : "text-brand-charcoal";

  const linkInactive = scrolled
    ? "text-brand-charcoal/60 hover:text-brand-charcoal"
    : isHome
      ? "text-white/70 hover:text-white"
      : "text-brand-charcoal/60 hover:text-brand-charcoal";

  const whatsappUrl = `https://wa.me/${agency.whatsapp_number}`;

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border ${navBg} px-5 py-3 backdrop-blur-xl transition-all duration-500`}
        >
          {/* Logo */}
          <NavLink
            to="/"
            className={`flex items-center gap-3 font-display text-xl font-bold tracking-tight transition-colors ${textColor}`}
          >
            {agency.logo_url && (
              <img src={agency.logo_url} alt={agency.agency_name} className="h-8 w-auto object-contain" />
            )}
            <span>
              {agency.agency_name}
            </span>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${isActive ? textColor : linkInactive
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute inset-0 -z-10 rounded-lg ${scrolled || !isHome
                          ? "bg-brand-sand/60"
                          : "bg-white/10"
                          }`}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6
                        }}
                      />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-brand-citrus px-5 py-2.5 text-xs font-bold text-brand-charcoal transition-all hover:bg-brand-gold hover:shadow-glow sm:inline-flex"
            >
              Request Callback
              <ArrowRight size={14} />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`rounded-lg p-2 transition md:hidden ${textColor}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? "bg-brand-sand text-brand-charcoal"
                      : "text-brand-charcoal/70 hover:bg-brand-sand/50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-xl bg-brand-citrus px-4 py-3 text-center text-sm font-bold text-brand-charcoal transition hover:bg-brand-gold"
              >
                Request Callback
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function Footer() {
  const { agency } = useAgency();
  const quickLinks = [
    { path: "/destinations", label: "Destinations" },
    { path: "/packages", label: "Packages" },
    { path: "/hotels", label: "Hotels" },
    { path: "/about", label: "About Us" }
  ];

  const socialLinks = [
    { icon: Instagram, url: agency.instagram_url },
    { icon: Twitter, url: agency.twitter_url },
    { icon: Facebook, url: agency.facebook_url },
    { icon: Youtube, url: agency.youtube_url }
  ].filter(link => link.url && link.url !== "#");

  return (
    <footer className="relative bg-brand-charcoal text-white">
      {/* Top decorative gradient line */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #EAA828, #D4A836, #F5B041)" }} />

      <div className="py-16">
        <div className="section-shell grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold">
              {agency.logo_url && (
                <img src={agency.logo_url} alt={agency.agency_name} className="h-8 w-auto brightness-0 invert" />
              )}
              {agency.agency_name}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Curating unforgettable travel experiences across India's most
              breathtaking landscapes. Your journey to incredible India begins
              here.
            </p>
            <div className="flex gap-3 pt-1">
              {socialLinks.map(({ icon: Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-brand-citrus/50 hover:bg-brand-citrus hover:text-brand-charcoal hover:shadow-glow"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${agency.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Why Us */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus">
              Why Choose Us
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                "Destination specialists",
                "Curated hotel partnerships",
                "WhatsApp-first support",
                "Best price guarantee"
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-citrus"
                />
                <span>{agency.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-citrus" />
                <span>{agency.contact_phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-citrus" />
                <span>{agency.support_email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="section-shell flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/35 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {agency.agency_name}. All rights
            reserved.
          </p>
          <p>Crafted with passion for incredible India.</p>
        </div>
      </div>
    </footer>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-brand-ivory selection:bg-brand-citrus selection:text-brand-charcoal">
      <Navbar />
      <main className={isHome ? "" : "pt-24 pb-20"}>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
