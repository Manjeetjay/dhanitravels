const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:4000/api/admin";

async function handleResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "Request failed.");
  }
  return body;
}

async function request(baseUrl, path, options = {}) {
  const { headers: optionHeaders, ...restOptions } = options;

  const isFormData =
    typeof FormData !== "undefined" && restOptions.body && restOptions.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(optionHeaders || {})
  };

  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    ...restOptions
  });
  return handleResponse(response);
}

export const publicApi = {
  getDestinations: () => request(API_URL, "/destinations"),
  getDestinationDetails: (idOrSlug) => request(API_URL, `/destinations/${idOrSlug}`),
  getPackages: (destinationId) =>
    request(API_URL, destinationId ? `/packages?destinationId=${destinationId}` : "/packages"),
  getPackageDetails: (id) => request(API_URL, `/packages/${id}`),
  getHotels: (destinationId) =>
    request(API_URL, destinationId ? `/hotels?destinationId=${destinationId}` : "/hotels"),
  submitLead: (payload) =>
    request(API_URL, "/leads", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getSettings: () => request(API_URL, `/settings?t=${Date.now()}`)
};

function adminRequest(path, adminKey, method = "GET", payload = null) {
  return request(ADMIN_API_URL, path, {
    method,
    headers: {
      "x-admin-key": adminKey
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
}

export const adminApi = {
  listDestinations: (adminKey) => adminRequest("/destinations", adminKey),
  createDestination: (adminKey, payload) => adminRequest("/destinations", adminKey, "POST", payload),
  updateDestination: (adminKey, id, payload) =>
    adminRequest(`/destinations/${id}`, adminKey, "PUT", payload),
  deleteDestination: (adminKey, id) => adminRequest(`/destinations/${id}`, adminKey, "DELETE"),

  listPackages: (adminKey) => adminRequest("/packages", adminKey),
  createPackage: (adminKey, payload) => adminRequest("/packages", adminKey, "POST", payload),
  updatePackage: (adminKey, id, payload) => adminRequest(`/packages/${id}`, adminKey, "PUT", payload),
  deletePackage: (adminKey, id) => adminRequest(`/packages/${id}`, adminKey, "DELETE"),

  listHotels: (adminKey) => adminRequest("/hotels", adminKey),
  createHotel: (adminKey, payload) => adminRequest("/hotels", adminKey, "POST", payload),
  updateHotel: (adminKey, id, payload) => adminRequest(`/hotels/${id}`, adminKey, "PUT", payload),
  deleteHotel: (adminKey, id) => adminRequest(`/hotels/${id}`, adminKey, "DELETE"),

  uploadImage: (adminKey, payload) => adminRequest("/uploads/images", adminKey, "POST", payload),

  listLeads: (adminKey) => adminRequest("/leads", adminKey),

  updateSettings: (adminKey, payload) => adminRequest("/settings", adminKey, "PUT", payload),

  verifyAdminKey: (adminKey) => adminRequest("/verify", adminKey, "GET")
};
