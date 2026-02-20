const { isServiceRoleKey, supabaseKeyRole } = require("../lib/supabase");

function requireServiceRole(req, res, next) {
  if (isServiceRoleKey) {
    return next();
  }

  return res.status(500).json({
    error: `Write operations require SUPABASE_SERVICE_ROLE_KEY with role 'service_role'. Current key role is '${supabaseKeyRole}'.`
  });
}

module.exports = { requireServiceRole };

