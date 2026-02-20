import { Link } from "react-router-dom";
import DestinationCard from "../components/DestinationCard";
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { publicApi } from "../lib/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80";

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await publicApi.getDestinations();
        setDestinations(response.data || []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="section-shell py-10">
      <SectionHeader
        eyebrow="Destinations"
        title="Explore India by region"
        subtitle="Each destination detail page links directly to travel packages and associated hotels."
      />

      {loading ? <p>Loading destinations...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && !error && destinations.length === 0 ? (
          <div className="card-surface sm:col-span-2 lg:col-span-3">
            <p className="text-sm text-brand-charcoal/70">
              No destinations available right now. Please check back later.
            </p>
          </div>
        ) : (
          destinations.map((item) => <DestinationCard key={item.id} destination={item} />)
        )}
      </div>
    </div>
  );
}

export default DestinationsPage;
