const { supabase } = require("../../lib/supabase");

async function getAgencySettings(req, res) {
    const { data, error } = await supabase
        .from("agency_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.set("Cache-Control", "no-store");
    // Return defaults if no row exists yet (or handled by frontend)
    return res.json({ data: data || {} });
}

module.exports = {
    getAgencySettings
};
