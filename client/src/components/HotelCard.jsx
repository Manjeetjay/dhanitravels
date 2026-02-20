import { Star } from "lucide-react";

function HotelCard({ hotel }) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

  const starCount = hotel.star_rating || 0;

  return (
    <article className="group overflow-hidden rounded-3xl border border-brand-charcoal/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover">
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.cover_image || fallbackImage}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Star badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-charcoal shadow-sm backdrop-blur-sm">
            {Array.from({ length: Math.min(starCount, 5) }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-brand-citrus text-brand-citrus"
              />
            ))}
            {starCount === 0 && <span className="text-brand-charcoal/60">Unrated</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-brand-charcoal">
            {hotel.name}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-clay">
            {hotel.destination?.name || "Destination"}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-brand-charcoal/65">
          {hotel.summary || "Comfort-focused stay with curated amenities."}
        </p>

        {/* Amenity pills */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full bg-brand-sand px-3 py-1 text-[11px] font-semibold text-brand-charcoal/70"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between border-t border-brand-charcoal/6 pt-4">
          <div>
            <p className="text-xs text-brand-charcoal/50">Per night from</p>
            <p className="font-display text-xl font-bold text-brand-charcoal">
              ₹
              {hotel.price_per_night
                ? Number(hotel.price_per_night).toLocaleString("en-IN")
                : "Custom"}
            </p>
          </div>
          <p className="text-xs font-medium text-brand-teal">
            {starCount > 0 ? `${starCount}-Star Property` : "Premium Stay"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
