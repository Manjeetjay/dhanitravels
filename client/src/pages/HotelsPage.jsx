import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import HotelCard from "../components/HotelCard";
import LeadForm from "../components/LeadForm";
import { publicApi } from "../lib/api";

function HotelsPage() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [destinationsResponse, packagesResponse, hotelsResponse] = await Promise.all([
          publicApi.getDestinations(),
          publicApi.getPackages(),
          publicApi.getHotels()
        ]);
        setDestinations(destinationsResponse.data || []);
        setPackages(packagesResponse.data || []);
        setHotels(hotelsResponse.data || []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load hotels.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredHotels = useMemo(() => {
    if (!selectedDestinationId) {
      return hotels;
    }
    return hotels.filter(
      (item) => String(item.destination_id) === String(selectedDestinationId)
    );
  }, [hotels, selectedDestinationId]);

  return (
    <div className="space-y-12 py-10">
      <section className="section-shell">
        <SectionHeader
          eyebrow="Hotels"
          title="Handpicked Stays Across India"
          subtitle="Browse partner hotels connected to our destinations and package itineraries."
        />

        <div className="card-surface mb-6 flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/70">
            Filter by destination
          </label>
          <select
            className="form-input max-w-xs"
            value={selectedDestinationId}
            onChange={(event) => setSelectedDestinationId(event.target.value)}
          >
            <option value="">All destinations</option>
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-brand-charcoal/70">
            Showing {filteredHotels.length} hotel(s)
          </span>
        </div>

        {loading ? <p>Loading hotels...</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {!loading && !error && filteredHotels.length === 0 ? (
            <div className="card-surface md:col-span-2 xl:col-span-3">
              <p className="text-sm text-brand-charcoal/70">
                No hotels found for this filter.
              </p>
            </div>
          ) : (
            filteredHotels.map((item) => <HotelCard key={item.id} hotel={item} />)
          )}
        </div>
      </section>
    </div>
  );
}

export default HotelsPage;

