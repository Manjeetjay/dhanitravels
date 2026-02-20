import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  ArrowRight,
  Star,
  IndianRupee,
  Building2,
  CheckCircle2,
  Sparkles,
  Phone,
  Loader2
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import LeadForm from "../components/LeadForm";
import { publicApi } from "../lib/api";
import { useAgency } from "../context/AgencyContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80";

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

function PackageDetailPage() {
  const { id } = useParams();
  const [packageItem, setPackageItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { agency } = useAgency();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await publicApi.getPackageDetails(id);
        setPackageItem(response.data);
      } catch (loadError) {
        setError(loadError.message || "Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-brand-charcoal/50">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm font-medium">Loading package...</span>
        </div>
      </div>
    );
  }

  if (error || !packageItem) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center">
          <p className="font-semibold text-red-600">
            {error || "Package not found."}
          </p>
          <Link
            to="/packages"
            className="mt-3 inline-block text-sm font-medium text-brand-teal hover:underline"
          >
            ← Browse all packages
          </Link>
        </div>
      </div>
    );
  }

  const highlights = packageItem.highlights || [];
  const hotels = packageItem.hotels || [];
  const destination = packageItem.destination;

  return (
    <div className="space-y-0">
      {/* ═══ Immersive Hero ═══ */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={packageItem.cover_image || fallbackImage}
            alt={packageItem.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/65 to-brand-charcoal/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(234,168,40,0.12),transparent_50%)]" />
        </div>

        <div className="section-shell relative z-10 flex min-h-[440px] flex-col justify-end pb-12 pt-32 sm:min-h-[500px] sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-4"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {packageItem.is_featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-citrus to-brand-gold px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-charcoal shadow-glow">
                  <Sparkles size={12} /> Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                <Clock size={12} />
                {packageItem.duration_days
                  ? `${packageItem.duration_days} Days`
                  : "Flexible"}
              </span>
              {destination && (
                <Link
                  to={`/destinations/${destination.slug || destination.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-citrus backdrop-blur-sm transition hover:bg-white/20"
                >
                  <MapPin size={12} />
                  {destination.name}
                </Link>
              )}
            </div>

            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {packageItem.name}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {packageItem.summary ||
                "A carefully curated travel experience designed for unforgettable memories."}
            </p>

            {/* Price bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  Starting from
                </p>
                <p className="flex items-center gap-1 font-display text-3xl font-bold text-white">
                  <IndianRupee size={22} className="text-brand-citrus" />
                  {packageItem.price_from
                    ? Number(packageItem.price_from).toLocaleString("en-IN")
                    : "Custom"}
                </p>
              </div>
              <div className="flex gap-3">
                <a href="#inquiry" className="btn-gold text-sm">
                  Book Now <ArrowRight size={14} />
                </a>
                {agency?.whatsapp_number && (
                  <a
                    href={`https://wa.me/${agency.whatsapp_number}?text=${encodeURIComponent(`Hi! I'm interested in the "${packageItem.name}" package.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-bold text-white transition-all hover:border-white/40 hover:bg-white/10"
                  >
                    <Phone size={14} /> WhatsApp
                  </a>
                )}
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

      {/* ═══ Highlights ═══ */}
      <section className="section-shell py-16">
        <SectionHeader
          eyebrow="Highlights"
          title="What's included"
          subtitle="Everything that makes this package special — from sightseeing to unique local experiences."
        />

        {highlights.length ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                variants={fadeUp}
                custom={index}
                className="flex items-start gap-3 rounded-2xl border border-brand-charcoal/8 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-brand-teal"
                />
                <span className="text-sm font-medium text-brand-charcoal/80">
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-charcoal/15 bg-white/50 py-12 text-center">
            <Sparkles
              size={32}
              className="mx-auto mb-3 text-brand-charcoal/20"
            />
            <p className="text-sm font-medium text-brand-charcoal/50">
              Highlights will be updated soon.
            </p>
          </div>
        )}
      </section>

      {/* ═══ Hotels ═══ */}
      <section className="bg-gradient-to-b from-brand-sand/60 to-brand-ivory py-16">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Accommodation"
            title="Where you'll stay"
            subtitle="Handpicked hotels and resorts that elevate your travel experience."
          />

          {hotels.length ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {hotels.map((hotel, i) => (
                <motion.article
                  key={hotel.id}
                  variants={fadeUp}
                  custom={i}
                  className="group overflow-hidden rounded-3xl border border-brand-charcoal/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {hotel.cover_image && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={hotel.cover_image}
                        alt={hotel.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {hotel.star_rating > 0 && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                          <Star
                            size={12}
                            className="fill-brand-citrus text-brand-citrus"
                          />
                          <span className="text-xs font-bold text-brand-charcoal">
                            {hotel.star_rating}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-brand-charcoal">
                        {hotel.name}
                      </h3>
                      {!hotel.cover_image && hotel.star_rating > 0 && (
                        <div className="flex items-center gap-1 rounded-full bg-brand-citrus/15 px-2.5 py-1">
                          <Star
                            size={12}
                            className="fill-brand-citrus text-brand-citrus"
                          />
                          <span className="text-xs font-bold text-brand-clay">
                            {hotel.star_rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {hotel.address && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-brand-charcoal/50">
                        <MapPin size={11} />
                        {hotel.address}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-2 text-sm text-brand-charcoal/60">
                      {hotel.summary || "A comfortable stay for your trip."}
                    </p>

                    {/* Amenities */}
                    {hotel.amenities?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 4).map((a, ai) => (
                          <span
                            key={ai}
                            className="rounded-full bg-brand-teal/8 px-2.5 py-1 text-[10px] font-semibold text-brand-teal"
                          >
                            {a}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="rounded-full bg-brand-charcoal/5 px-2.5 py-1 text-[10px] font-semibold text-brand-charcoal/40">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {hotel.price_per_night && (
                      <div className="mt-4 border-t border-brand-charcoal/8 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-charcoal/40">
                          Per night
                        </p>
                        <p className="flex items-center gap-1 font-display text-lg font-bold text-brand-clay">
                          <IndianRupee size={14} />
                          {Number(hotel.price_per_night).toLocaleString(
                            "en-IN"
                          )}
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
                Hotel details will be added soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="section-shell py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-charcoal px-8 py-14 text-center text-white shadow-2xl sm:px-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,168,40,0.15),transparent_50%)]" />
          <div className="relative space-y-4">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready to book {packageItem.name}?
            </h2>
            <p className="mx-auto max-w-lg text-sm text-white/60">
              Fill out the inquiry form below and our travel experts will
              customize this package to fit your schedule, budget and
              preferences.
            </p>
            <a
              href="#inquiry"
              className="btn-gold mt-2 inline-flex"
            >
              Inquire Now <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default PackageDetailPage;
