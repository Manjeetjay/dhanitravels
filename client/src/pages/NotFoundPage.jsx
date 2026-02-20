import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="section-shell py-20">
      <div className="card-surface max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-clay">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-brand-charcoal/75">
          This route does not exist. Return to the homepage or browse destinations.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
          <Link to="/destinations" className="btn-secondary">
            Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

