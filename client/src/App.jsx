import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import PackagesPage from "./pages/PackagesPage";
import PackageDetailPage from "./pages/PackageDetailPage";
import HotelsPage from "./pages/HotelsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminShell from "./components/admin/AdminShell";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminDestinationsPage from "./pages/admin/AdminDestinationsPage";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage";
import AdminHotelsPage from "./pages/admin/AdminHotelsPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import { AgencyProvider } from "./context/AgencyContext";

function App() {
  return (
    <AgencyProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:idOrSlug" element={<DestinationDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="destinations" element={<AdminDestinationsPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="hotels" element={<AdminHotelsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AgencyProvider>
  );
}

export default App;
