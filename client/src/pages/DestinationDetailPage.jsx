import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  IndianRupee,
  Building2,
  Sparkles,
  Package,
  Loader2
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import LeadForm from "../components/LeadForm";
import { publicApi } from "../lib/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

function DestinationDetailPage() {
  const { idOrSlug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await publicApi.getDestinationDetails(idOrSlug);
        setDestination(response.data);
      } catch (loadError) {
        setError(loadError.message || "Failed to load destination details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-brand-charcoal/50">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm font-medium">Loading destination...</span>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center">
          <p className="font-semibold text-red-600">
            {error || "Destination not found."}
          </p>
          <Link
            to="/destinations"
            className="mt-3 inline-block text-sm font-medium text-brand-teal hover:underline"
          >
            ← Browse all destinations
          </Link>
        </div>
      </div>
    );
  }

  const hotels = destination.hotels || [];
  const packages = destination.packages || [];

  return (
    <div className="space-y-0">
      {/* ═══ Immersive Hero ═══ */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={destination.hero_image || fallbackImage}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/60 to-brand-charcoal/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(234,168,40,0.1),transparent_50%)]" />
        </div>

        <div className="section-shell relative z-10 flex min-h-[420px] flex-col justify-end pb-12 pt-32 sm:min-h-[480px] sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                <MapPin size={12} />
                {destination.state || "India"}
              </span>
              {destination.best_time && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-citrus backdrop-blur-sm">
                  <Calendar size={12} />
                  Best: {destination.best_time}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {destination.name}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {destination.short_description ||
                "Explore this incredible destination with our curated travel packages."}
            </p>

            <div className="flex flex-wrap gap-5 pt-1">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Package size={16} className="text-brand-citrus" />
                <span>
                  <strong className="text-white">{packages.length}</strong>{" "}
                  {packages.length === 1 ? "Package" : "Packages"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Building2 size={16} className="text-brand-citrus" />
                <span>
                  <strong className="text-white">{hotels.length}</strong>{" "}
                  {hotels.length === 1 ? "Hotel" : "Hotels"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 30C360 60 720 0 1080 30C1260 45 1380 40 1440 35V60H0V30Z"
              fill="#FFF9F0"
            />
          </svg>
        </div>
      </section>

      {/* ═══ About This Destination ═══ */}
      {destination.long_description && (
        <section className="section-shell py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl rounded-3xl border border-brand-charcoal/8 bg-white p-8 shadow-soft sm:p-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-brand-citrus" />
              <h2 className="font-display text-2xl font-bold text-brand-charcoal">
                About {destination.name}
              </h2>
            </div>
            <div className="gold-line mb-5" />
            <p className="text-sm leading-relaxed text-brand-charcoal/70 sm:text-base">
              {destination.long_description}
            </p>
          </motion.div>
        </section>
      )}

      {/* ═══ Packages ═══ */}
      <section className="section-shell py-14">
        <SectionHeader
          eyebrow="Packages"
          title={`Explore ${destination.name} packages`}
          subtitle="Handcrafted itineraries designed to give you the best experience at every price point."
        />

        {packages.length ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {packages.map((item, i) => (
              <motion.article
                key={item.id}
                variants={fadeUp}
                custom={i}
                className="group relative overflow-hidden rounded-3xl border border-brand-charcoal/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* Cover image */}
                {item.cover_image && (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.cover_image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {item.is_featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-brand-citrus to-brand-gold px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-charcoal shadow-glow">
                        Featured
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Duration badge */}
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-teal">
                    <Clock size={13} />
                    {item.duration_days
                      ? `${item.duration_days} Days`
                      : "Flexible Duration"}
                  </div>

                  <h3 className="mt-2 font-display text-xl font-bold text-brand-charcoal">
                    {item.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-brand-charcoal/60">
                    {item.summary || "A carefully crafted travel experience."}
                  </p>

                  {/* Highlights preview */}
                  {item.highlights?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.highlights.slice(0, 3).map((h, hi) => (
                        <span
                          key={hi}
                          className="rounded-full bg-brand-sand px-2.5 py-1 text-[10px] font-semibold text-brand-charcoal/70"
                        >
                          {h}
                        </span>
                      ))}
                      {item.highlights.length > 3 && (
                        <span className="rounded-full bg-brand-sand px-2.5 py-1 text-[10px] font-semibold text-brand-charcoal/50">
                          +{item.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-5 flex items-center justify-between border-t border-brand-charcoal/8 pt-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-charcoal/40">
                        Starting from
                      </p>
                      <p className="flex items-center gap-1 font-display text-xl font-bold text-brand-clay">
                        <IndianRupee size={16} />
                        {item.price_from
                          ? Number(item.price_from).toLocaleString("en-IN")
                          : "Custom"}
                      </p>
                    </div>
                    <Link
                      to={`/packages/${item.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-charcoal px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-slate hover:shadow-lg"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-charcoal/15 bg-white/50 py-12 text-center">
            <Package size={32} className="mx-auto mb-3 text-brand-charcoal/20" />
            <p className="text-sm font-medium text-brand-charcoal/50">
              No packages available for this destination yet.
            </p>
          </div>
        )}
      </section>

      {/* ═══ Hotels ═══ */}
      <section className="bg-gradient-to-b from-brand-sand/60 to-brand-ivory py-16">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Stays"
            title="Recommended hotels & resorts"
            subtitle="Vetted accommodations to match every budget and travel style."
          />

          {hotels.length ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {hotels.map((item, i) => (
                <motion.article
                  key={item.id}
                  variants={fadeUp}
                  custom={i}
                  className="group overflow-hidden rounded-3xl border border-brand-charcoal/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {item.cover_image && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.cover_image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-brand-charcoal">
                        {item.name}
                      </h3>
                      {item.star_rating > 0 && (
                        <div className="flex items-center gap-1 rounded-full bg-brand-citrus/15 px-2.5 py-1">
                          <Star
                            size={12}
                            className="fill-brand-citrus text-brand-citrus"
                          />
                          <span className="text-xs font-bold text-brand-clay">
                            {item.star_rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.address && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-brand-charcoal/50">
                        <MapPin size={11} />
                        {item.address}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-2 text-sm text-brand-charcoal/60">
                      {item.summary || "Quality accommodation for your stay."}
                    </p>

                    {/* Amenities */}
                    {item.amenities?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.amenities.slice(0, 4).map((a, ai) => (
                          <span
                            key={ai}
                            className="rounded-full bg-brand-teal/8 px-2.5 py-1 text-[10px] font-semibold text-brand-teal"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.price_per_night && (
                      <div className="mt-4 border-t border-brand-charcoal/8 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-charcoal/40">
                          Per night
                        </p>
                        <p className="flex items-center gap-1 font-display text-lg font-bold text-brand-clay">
                          <IndianRupee size={14} />
                          {Number(item.price_per_night).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-charcoal/15 bg-white/50 py-12 text-center">
              <Building2
                size={32}
                className="mx-auto mb-3 text-brand-charcoal/20"
              />
              <p className="text-sm font-medium text-brand-charcoal/50">
                No hotels listed for this destination yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DestinationDetailPage;
