import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

function PackageCard({ pkg }) {
    const fallbackImage =
        "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80";

    return (
        <Link
            to={`/packages/${pkg.id}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
        >
            {/* Cover image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={pkg.cover_image || fallbackImage}
                    alt={pkg.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Duration badge */}
                <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-charcoal shadow-sm backdrop-blur-sm">
                        <Calendar size={13} />
                        {pkg.duration_days || "Flexible"} Days
                    </span>
                </div>

                {/* Featured badge */}
                {pkg.is_featured && (
                    <div className="absolute top-4 right-4">
                        <span className="rounded-full bg-brand-citrus px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-charcoal shadow-glow">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                    <h3 className="font-display text-2xl font-bold text-brand-charcoal transition-colors group-hover:text-brand-clay">
                        {pkg.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/60 line-clamp-3">
                        {pkg.summary ||
                            "Experience the best of this destination with our curated itinerary."}
                    </p>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-brand-charcoal/6 pt-5">
                    <div>
                        <p className="text-xs font-medium text-brand-charcoal/50">
                            Starting from
                        </p>
                        <p className="font-display text-2xl font-bold text-brand-charcoal">
                            ₹
                            {pkg.price_from
                                ? Number(pkg.price_from).toLocaleString("en-IN")
                                : "Custom"}
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-charcoal/5 text-brand-charcoal transition-all duration-300 group-hover:bg-brand-citrus group-hover:text-brand-charcoal group-hover:shadow-glow">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PackageCard;
