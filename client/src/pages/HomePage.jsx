import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Map,
  Headphones,
  Users,
  Star,
  Shield
} from "lucide-react";
import { publicApi } from "../lib/api";
import HeroCarousel from "../components/HeroCarousel";
import LeadForm from "../components/LeadForm";
import SectionHeader from "../components/SectionHeader";
import DestinationCard from "../components/DestinationCard";
import PackageCard from "../components/PackageCard";
import HotelCard from "../components/HotelCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const features = [
  {
    icon: Globe,
    title: "Expert Local Knowledge",
    desc: "Our destination specialists have personally explored every location we offer, ensuring authentic recommendations."
  },
  {
    icon: Map,
    title: "Tailored Itineraries",
    desc: "Every journey is crafted around your preferences — from heritage walks to adventure trails, no two trips are alike."
  },
  {
    icon: Headphones,
    title: "24/7 Trip Support",
    desc: "WhatsApp-first on-ground assistance ensures peace of mind throughout your journey across India."
  }
];

const stats = [
  { value: "500+", label: "Happy Travellers" },
  { value: "50+", label: "Destinations" },
  { value: "100+", label: "Curated Packages" },
  { value: "4.9★", label: "Average Rating" }
];

const trustPoints = [
  {
    icon: Shield,
    title: "Best Price Guarantee",
    desc: "We match any comparable itinerary price."
  },
  {
    icon: Users,
    title: "Small Group Tours",
    desc: "Intimate experiences with like-minded travellers."
  },
  {
    icon: Star,
    title: "Verified Reviews",
    desc: "Real feedback from 500+ happy customers."
  }
];

function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [destinationResponse, packageResponse, hotelResponse] =
          await Promise.all([
            publicApi.getDestinations(),
            publicApi.getPackages(),
            publicApi.getHotels()
          ]);
        setDestinations(destinationResponse.data || []);
        setPackages(packageResponse.data || []);
        setHotels(hotelResponse.data || []);
      } catch (loadError) {
        setError(loadError.message || "Could not load homepage data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featuredPackages = useMemo(() => {
    const selected = packages.filter((item) => item.is_featured);
    return (selected.length ? selected : packages).slice(0, 3);
  }, [packages]);

  const featuredHotels = useMemo(() => hotels.slice(0, 3), [hotels]);

  return (
    <div>
      {/* Hero Carousel — full bleed, navbar floats on top */}
      <HeroCarousel />

      <div className="space-y-28 pt-20 pb-6">
        {/* Destinations Section */}
        <section className="section-shell">
          <SectionHeader
            eyebrow="Destinations"
            title="Where do you want to go?"
            subtitle="Explore our handpicked collection of India's most breathtaking locations, each offering a unique story."
          />

          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-brand-citrus border-t-transparent" />
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {destinations.length ? (
                destinations.slice(0, 4).map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <DestinationCard destination={item} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="card-surface sm:col-span-2 lg:col-span-3"
                >
                  <p className="text-sm text-brand-charcoal/70">
                    No destinations are published yet. Add data from the admin
                    panel.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          <div className="mt-12 flex justify-center">
            <Link
              to="/destinations"
              className="group inline-flex items-center gap-2 rounded-full border border-brand-charcoal/15 px-8 py-3 text-sm font-bold text-brand-charcoal transition-all hover:border-brand-citrus hover:text-brand-citrus hover:shadow-glow"
            >
              View all destinations
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* Featured Packages Section */}
        <section className="bg-brand-charcoal py-28 text-white">
          <div className="section-shell">
            <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus">
                  Featured Packages
                </span>
                <h2 className="font-display text-4xl font-bold sm:text-5xl">
                  Curated Itineraries
                </h2>
                <p className="mt-3 max-w-xl text-sm text-white/60">
                  Expertly crafted multi-day journeys through India's most
                  iconic regions, complete with accommodation and local
                  experiences.
                </p>
              </div>
              <Link
                to="/packages"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold transition-all hover:bg-white hover:text-brand-charcoal"
              >
                See all packages
                <ArrowRight size={16} />
              </Link>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {featuredPackages.length ? (
                featuredPackages.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <PackageCard pkg={item} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-white/15 bg-white/5 p-6 md:col-span-2 lg:col-span-3"
                >
                  <p className="text-sm text-white/75">
                    No packages are available yet. Create packages in admin to
                    show featured itineraries.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="section-shell">
          <SectionHeader
            eyebrow="Why Dhani Journeys"
            title="Travel with confidence"
            subtitle="We go beyond booking — our experts design journeys that create lasting memories."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-3xl border border-brand-charcoal/8 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-citrus/20 to-brand-gold/10 text-brand-clay transition-colors group-hover:from-brand-citrus/30 group-hover:to-brand-gold/20">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/65">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Trust Strip */}
        <section className="section-shell">
          <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-brand-charcoal to-brand-slate p-10 text-white sm:p-14 md:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-citrus/15 text-brand-citrus">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold">
                      {point.title}
                    </h4>
                    <p className="mt-1 text-sm text-white/60">{point.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hotel Preview Section */}
        <section className="section-shell">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Partner Hotels"
              title="Comfort-first stays"
              subtitle="Choose from verified hotels connected to our destinations and itineraries."
            />
            <Link
              to="/hotels"
              className="group inline-flex items-center gap-2 rounded-full border border-brand-charcoal/15 px-7 py-3.5 text-sm font-semibold transition-all hover:border-brand-teal hover:text-brand-teal"
            >
              View all hotels
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredHotels.length ? (
              featuredHotels.map((item) => (
                <HotelCard key={item.id} hotel={item} />
              ))
            ) : (
              <div className="card-surface md:col-span-2 xl:col-span-3">
                <p className="text-sm text-brand-charcoal/70">
                  No hotels available yet. Add hotels from the admin panel.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Lead Form Section */}
        <section className="section-shell pb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-charcoal to-brand-slate px-6 py-16 text-center text-white shadow-2xl sm:px-12 sm:py-24">
            <div className="relative z-10 mx-auto max-w-3xl space-y-6">
              <span className="inline-block rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus backdrop-blur-sm">
                Start Planning
              </span>
              <h2 className="font-display text-4xl font-bold sm:text-5xl">
                Ready to start your journey?
              </h2>
              <p className="mx-auto max-w-xl text-lg text-white/65">
                Fill out the form below and let us craft the perfect itinerary
                for your next adventure across India.
              </p>
              <div className="mt-8 rounded-2xl bg-white p-1 text-left text-brand-charcoal">
                <LeadForm destinations={destinations} packages={packages} />
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-citrus/15 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-teal/10 via-transparent to-transparent opacity-40" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
