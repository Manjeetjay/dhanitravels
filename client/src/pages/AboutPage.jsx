import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Users,
  Award,
  Compass,
  CheckCircle2,
  Phone,
  Star,
  Mountain,
  Palmtree,
  Plane,
  Clock,
  IndianRupee,
  MessagesSquare,
  ArrowRight
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import LeadForm from "../components/LeadForm";
import { publicApi } from "../lib/api";
import { useAgency } from "../context/AgencyContext";

/* ── Data ────────────────────────────────── */

const stats = [
  { value: "500+", label: "Happy Travellers", icon: Users },
  { value: "50+", label: "Destinations Covered", icon: MapPin },
  { value: "4.9★", label: "Customer Rating", icon: Star },
  { value: "8+", label: "Years of Experience", icon: Award }
];

const journeySteps = [
  {
    step: "01",
    title: "Share Your Vision",
    description:
      "Tell us your dream destination, budget, travel dates and group size. Every journey starts with understanding what matters most to you.",
    icon: MessagesSquare,
    color: "from-brand-citrus/20 to-brand-gold/10"
  },
  {
    step: "02",
    title: "Curated Itinerary",
    description:
      "Our travel experts craft a bespoke plan — handpicked hotels, unique local experiences, seamless logistics — all tailored to your style.",
    icon: Compass,
    color: "from-brand-teal/15 to-brand-teal/5"
  },
  {
    step: "03",
    title: "Book with Confidence",
    description:
      "Transparent pricing, no hidden costs. Review every detail, make changes, and confirm when you're 100% satisfied with the plan.",
    icon: IndianRupee,
    color: "from-brand-clay/15 to-brand-clay/5"
  },
  {
    step: "04",
    title: "Travel & Enjoy",
    description:
      "Embark on your journey with 24/7 on-trip support. We handle the details so you can focus on making memories.",
    icon: Plane,
    color: "from-brand-citrus/20 to-brand-amber/10"
  }
];

const values = [
  {
    icon: Globe2,
    title: "Local Expertise",
    description:
      "Our on-ground destination specialists have lived, explored and built relationships across India. Every recommendation comes from first-hand experience, not a brochure."
  },
  {
    icon: HeartHandshake,
    title: "Personal Touch",
    description:
      "No two travellers are the same. We listen to your preferences, dietary needs, pace of travel and interests to build a trip that feels uniquely yours."
  },
  {
    icon: ShieldCheck,
    title: "Reliable Operations",
    description:
      "Vetted hotel partners, backup transport plans, and standard operating processes mean fewer surprises and more peace of mind on every trip."
  },
  {
    icon: Clock,
    title: "Swift Responses",
    description:
      "WhatsApp-first communication means you get answers in minutes, not days. Our team is available before, during and after your trip."
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    description:
      "Every quote breaks down hotel, transport, meals and activities. No hidden charges, no last-minute surprises — what you see is what you pay."
  },
  {
    icon: Mountain,
    title: "Unique Experiences",
    description:
      "From sunrise treks in the Himalayas to houseboat stays in Kerala — we curate moments that go beyond typical tourist itineraries."
  }
];

const promises = [
  "Quick WhatsApp-first responses to every inquiry",
  "Clear package inclusions and transparent pricing",
  "Hotel options mapped by destination and budget",
  "Dedicated support before, during and after travel",
  "Flexible cancellation and rescheduling policies",
  "Verified accommodations and trusted transport partners"
];

const featuredDestinations = [
  { name: "Rajasthan", tagline: "Royal heritage & golden deserts" },
  { name: "Kerala", tagline: "Backwaters, spices & bliss" },
  { name: "Himachal", tagline: "Mountain escapes & adventure" },
  { name: "Goa", tagline: "Beaches, culture & nightlife" },
  { name: "Kashmir", tagline: "Paradise on earth" },
  { name: "Uttarakhand", tagline: "Spiritual trails & valleys" }
];

/* ── Animations ──────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

/* ── Page ─────────────────────────────────── */

function AboutPage() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const { agency } = useAgency();

  useEffect(() => {
    const load = async () => {
      try {
        const [destinationsResponse, packagesResponse] = await Promise.all([
          publicApi.getDestinations(),
          publicApi.getPackages()
        ]);
        setDestinations(destinationsResponse.data || []);
        setPackages(packagesResponse.data || []);
      } catch {
        setDestinations([]);
        setPackages([]);
      }
    };
    load();
  }, []);

  const agencyName = agency?.agency_name || "Dhani Journeys";

  return (
    <div className="space-y-0">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-charcoal via-brand-slate to-brand-charcoal">
        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(234,168,40,0.18),transparent_45%),radial-gradient(circle_at_10%_80%,rgba(13,96,109,0.2),transparent_50%)]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-citrus/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-teal/8 blur-3xl" />

        <div className="section-shell relative z-10 flex min-h-[520px] flex-col justify-center py-20 sm:py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus backdrop-blur-sm">
              <Palmtree size={14} />
              About {agencyName}
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Crafting unforgettable journeys across{" "}
              <span className="bg-gradient-to-r from-brand-citrus via-brand-gold to-brand-amber bg-clip-text text-transparent">
                incredible India
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              We are a team of passionate travel architects who believe every
              trip should be more than a vacation — it should be a story worth
              telling. From the snow-capped Himalayas to the sun-kissed beaches
              of Goa, we turn your travel dreams into reality.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#contact" className="btn-gold">
                Plan Your Trip <ArrowRight size={16} />
              </a>
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition-all hover:border-white/30 hover:bg-white/5"
              >
                Our Story
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              fill="#FFF9F0"
            />
          </svg>
        </div>
      </section>


      {/* ═══ Our Story ═══ */}
      <section id="our-story" className="section-shell pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <SectionHeader
              eyebrow="Our Story"
              title="Born from a love for Indian travel"
            />
            <div className="space-y-4 text-sm leading-relaxed text-brand-charcoal/70 sm:text-base">
              <p>
                {agencyName} was founded with a simple belief:{" "}
                <strong className="text-brand-charcoal">
                  travel planning should be personal, transparent and exciting
                </strong>
                . Too many agencies offer cookie-cutter packages with hidden
                costs. We set out to change that.
              </p>
              <p>
                Starting from a small office with just two destination
                specialists, we've grown into a team of passionate travel
                experts covering over 50 destinations across India. From the
                royal forts of Rajasthan to the tranquil backwaters of Kerala,
                we've personally explored every destination we recommend.
              </p>
              <p>
                What makes us different? We don't just sell trips — we{" "}
                <strong className="text-brand-charcoal">
                  design experiences
                </strong>
                . Every itinerary is built around your interests, your pace, and
                your budget. We maintain a curated network of vetted hotels,
                local guides and transport partners to ensure quality at every
                touchpoint.
              </p>
            </div>
          </motion.div>

          {/* Right — Visual card grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {featuredDestinations.map((dest, i) => (
              <div
                key={dest.name}
                className={`group relative overflow-hidden rounded-2xl border border-brand-charcoal/8 bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${i % 3 === 0
                    ? "from-brand-teal/8 to-brand-teal/3"
                    : i % 3 === 1
                      ? "from-brand-citrus/10 to-brand-gold/5"
                      : "from-brand-clay/8 to-brand-clay/3"
                  } ${i === 0 || i === 5 ? "sm:col-span-1" : ""}`}
              >
                <MapPin
                  size={18}
                  className="mb-2 text-brand-teal opacity-60 transition-opacity group-hover:opacity-100"
                />
                <h4 className="font-display text-lg font-bold text-brand-charcoal">
                  {dest.name}
                </h4>
                <p className="mt-0.5 text-xs text-brand-charcoal/55">
                  {dest.tagline}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="bg-gradient-to-b from-brand-sand/60 to-brand-ivory py-20">
        <div className="section-shell">
          <SectionHeader
            eyebrow="How It Works"
            title="Your journey in 4 simple steps"
            subtitle="From the first conversation to your departure day, here's how we make travel planning effortless."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group relative rounded-3xl border border-brand-charcoal/8 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {/* Step number */}
                  <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-brand-citrus to-brand-gold px-3 py-1 text-xs font-extrabold text-brand-charcoal shadow-glow">
                    {item.step}
                  </span>

                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-brand-charcoal transition-transform group-hover:scale-110`}
                  >
                    <Icon size={26} />
                  </span>

                  <h3 className="mt-5 font-display text-xl font-semibold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/60">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Why Choose Us ═══ */}
      <section className="section-shell py-20">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="What sets us apart"
          subtitle="We don't just plan trips — we craft stories. Here's what our travellers love about us."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={fadeUp}
                custom={i}
                className="group rounded-3xl border border-brand-charcoal/8 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-citrus/20 to-brand-gold/10 text-brand-clay transition-all group-hover:scale-110 group-hover:from-brand-citrus/30">
                  <Icon size={26} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/60">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* ═══ Our Promise ═══ */}
      <section className="bg-gradient-to-br from-brand-charcoal via-brand-slate to-brand-charcoal py-20">
        <div className="section-shell">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus">
                Our Promise
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                What you can always expect from us
              </h2>
              <div className="gold-line mt-4" />
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
                We hold ourselves to a high standard because your trust is
                everything. These commitments aren't marketing speak — they're
                how we operate every single day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-3"
            >
              {promises.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/5 px-5 py-4 backdrop-blur-sm"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-citrus"
                  />
                  <span className="text-sm font-medium text-white/80">
                    {line}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="section-shell py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-charcoal px-8 py-16 text-center text-white shadow-2xl sm:px-16 sm:py-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,168,40,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(13,96,109,0.2),transparent_50%)]" />
          <div className="relative space-y-5">
            <Compass size={40} className="mx-auto text-brand-citrus" />
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ready to explore India?
            </h2>
            <p className="mx-auto max-w-xl text-base text-white/65">
              Whether it's a family getaway, a honeymoon, or a solo adventure —
              our experts are here to craft the perfect plan for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a href="#contact" className="btn-gold">
                Start Planning <ArrowRight size={16} />
              </a>
              {agency?.whatsapp_number && (
                <a
                  href={`https://wa.me/${agency.whatsapp_number}?text=${encodeURIComponent("Hi! I'd like to plan a trip with your team.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all hover:border-white/40 hover:bg-white/10"
                >
                  <Phone size={16} /> WhatsApp Us
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default AboutPage;
