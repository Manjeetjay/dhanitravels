const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    `Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in ${path.resolve(
      __dirname,
      "../../.env"
    )}.`
  );
}

function decodeJwtPayload(token) {
  let normalized = String(token || "").trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  const parts = normalized.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf8"
    );
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

const serviceKeyPayload = decodeJwtPayload(supabaseServiceRoleKey);
const supabaseKeyRole = serviceKeyPayload?.role || "unknown";
const isServiceRoleKey = supabaseKeyRole === "service_role";

if (!isServiceRoleKey) {
  console.warn(
    `[supabase] SUPABASE_SERVICE_ROLE_KEY role is '${supabaseKeyRole}'. GET endpoints can work, but POST/PUT/DELETE will fail due to RLS. Use the service_role key.`
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

module.exports = { supabase, isServiceRoleKey, supabaseKeyRole };
