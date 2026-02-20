import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
    {
        image:
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80",
        title: "Discover the Majesty of Rajasthan",
        subtitle:
            "Explore ancient forts, vibrant bazaars and golden deserts that tell stories of royal India.",
        cta: { label: "Explore Rajasthan", to: "/destinations" }
    },
    {
        image:
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=80",
        title: "The Timeless Beauty of the Taj",
        subtitle:
            "Witness the world's greatest monument to love and the rich Mughal heritage of Agra.",
        cta: { label: "View Packages", to: "/packages" }
    },
    {
        image:
            "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=80",
        title: "Serenity in Kerala Backwaters",
        subtitle:
            "Drift through emerald waterways on a traditional houseboat — the quintessential Indian escape.",
        cta: { label: "Discover Kerala", to: "/destinations" }
    },
    {
        image:
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=80",
        title: "Himalayan Adventures Await",
        subtitle:
            "From Ladakh's moonscapes to Manali's pine forests — find your mountain calling.",
        cta: { label: "Plan Your Trip", to: "/packages" }
    },
    {
        image:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80",
        title: "Sun, Sand & Sacred Shores",
        subtitle:
            "Goa's golden beaches, ancient temples and vibrant nightlife create the perfect coastal getaway.",
        cta: { label: "Explore Beaches", to: "/destinations" }
    }
];

function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const goTo = useCallback(
        (index) => {
            setDirection(index > current ? 1 : -1);
            setCurrent(index);
        },
        [current]
    );

    const next = useCallback(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 5500);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background images with crossfade */}
            <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
                <div className="section-shell">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                            className="max-w-3xl"
                        >
                            <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-citrus backdrop-blur-md">
                                Discover Incredible India
                            </span>

                            <h1 className="font-display text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                                {slide.title}
                            </h1>

                            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/75 sm:text-xl">
                                {slide.subtitle}
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link
                                    to={slide.cta.to}
                                    className="btn-gold group"
                                >
                                    {slide.cta.label}
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                                <Link
                                    to="/about"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation arrows */}
            <div className="absolute left-5 right-5 top-1/2 z-20 flex -translate-y-1/2 justify-between pointer-events-none">
                <button
                    onClick={prev}
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={22} />
                </button>
                <button
                    onClick={next}
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110"
                    aria-label="Next slide"
                >
                    <ChevronRight size={22} />
                </button>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-500 ${i === current
                                ? "w-10 bg-brand-citrus"
                                : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-brand-ivory to-transparent" />
        </section>
    );
}

export default HeroCarousel;
