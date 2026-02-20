import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";

function DestinationCard({ destination }) {
    const fallbackImage =
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80";

    return (
        <Link
            to={`/destinations/${destination.slug || destination.id}`}
            className="group relative flex h-[420px] w-full flex-col overflow-hidden rounded-3xl"
        >
            <img
                src={destination.hero_image || fallbackImage}
                alt={destination.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/15" />

            {/* Arrow icon */}
            <div className="absolute top-5 right-5 translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-brand-charcoal shadow-lg backdrop-blur-sm">
                    <ArrowUpRight size={20} />
                </div>
            </div>

            {/* Location badge */}
            {destination.state && (
                <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        <MapPin size={12} />
                        {destination.state}
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="relative mt-auto p-7">
                {!destination.state && (
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-citrus">
                        India
                    </p>
                )}
                <h3 className="font-display text-3xl font-bold text-white drop-shadow-md">
                    {destination.name}
                </h3>
                <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-24 group-hover:opacity-100">
                    <p className="text-sm leading-relaxed text-white/80 line-clamp-2">
                        {destination.short_description ||
                            "Curated experiences and handpicked accommodations await."}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default DestinationCard;
