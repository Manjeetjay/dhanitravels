import { Link } from "react-router-dom";
import PackageCard from "../components/PackageCard";
import { useEffect, useState } from "react";
import { publicApi } from "../lib/api";
import SectionHeader from "../components/SectionHeader";

const fallbackImage =
  "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80";

function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await publicApi.getPackages();
        setPackages(response.data || []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="section-shell py-10">
      <SectionHeader
        eyebrow="Packages"
        title="Multi-day travel packages"
        subtitle="Packages can be linked to destinations and optionally mapped to multiple hotels."
      />

      {loading ? <p>Loading packages...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {!loading && !error && packages.length === 0 ? (
          <div className="card-surface md:col-span-2 xl:col-span-3">
            <p className="text-sm text-brand-charcoal/70">
              No packages available right now. Please check back later.
            </p>
          </div>
        ) : (
          packages.map((item) => <PackageCard key={item.id} pkg={item} />)
        )}
      </div>
    </div>
  );
}

export default PackagesPage;
