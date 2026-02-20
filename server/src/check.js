const { app } = require("./index");
const { isServiceRoleKey, supabaseKeyRole } = require("./lib/supabase");

const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "WHATSAPP_NUMBER",
  "ADMIN_PANEL_KEY"
];

function summarizeMissingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

async function checkEndpoint(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

async function callJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

async function run() {
  const missingEnv = summarizeMissingEnv();
  if (missingEnv.length) {
    console.error(`[check] Missing env vars: ${missingEnv.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  if (!isServiceRoleKey) {
    console.error(
      `[check] SUPABASE_SERVICE_ROLE_KEY role is '${supabaseKeyRole}'. POST/PUT/DELETE endpoints will fail. Use the service_role key.`
    );
    process.exitCode = 1;
    return;
  }

  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const health = await checkEndpoint(baseUrl, "/health");
    if (health.status !== 200 || health.body?.status !== "ok") {
      console.error("[check] /health failed:", health);
      process.exitCode = 1;
      return;
    }
    console.log("[check] /health OK");

    const destinations = await checkEndpoint(baseUrl, "/api/destinations");
    if (destinations.status !== 200) {
      console.error("[check] /api/destinations failed:", destinations);
      process.exitCode = 1;
      return;
    }

    const count = Array.isArray(destinations.body?.data) ? destinations.body.data.length : 0;
    console.log(`[check] /api/destinations OK (${count} row(s))`);

    const slug = `check-${Date.now()}`;
    const createDestination = await callJson(baseUrl, "/api/admin/destinations", {
      method: "POST",
      headers: {
        "x-admin-key": process.env.ADMIN_PANEL_KEY
      },
      body: JSON.stringify({
        name: "Health Check Destination",
        slug
      })
    });

    if (createDestination.status !== 201 || !createDestination.body?.data?.id) {
      console.error("[check] POST /api/admin/destinations failed:", createDestination);
      process.exitCode = 1;
      return;
    }

    const destinationId = createDestination.body.data.id;
    console.log(`[check] POST /api/admin/destinations OK (id=${destinationId})`);

    const deleteDestination = await callJson(baseUrl, `/api/admin/destinations/${destinationId}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": process.env.ADMIN_PANEL_KEY
      }
    });

    if (deleteDestination.status !== 204) {
      console.error("[check] DELETE /api/admin/destinations/:id failed:", deleteDestination);
      process.exitCode = 1;
      return;
    }
    console.log("[check] DELETE /api/admin/destinations/:id OK");

    console.log("[check] Backend read/write checks passed.");
  } catch (error) {
    console.error("[check] Backend check failed:", error.message);
    process.exitCode = 1;
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

run();
