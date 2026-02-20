const { supabase } = require("../../lib/supabase");
const { pickFields } = require("../../utils/helpers");

async function updateAgencySettings(req, res) {
    const payload = pickFields(req.body, [
        "agency_name",
        "logo_url",
        "contact_phone",
        "whatsapp_number",
        "support_email",
        "address",
        "instagram_url",
        "facebook_url",
        "twitter_url",
        "youtube_url"
    ]);

    // Upsert for id=1
    const { data, error } = await supabase
        .from("agency_settings")
        .upsert({ id: 1, ...payload, updated_at: new Date() })
        .select("*")
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json({ data });
}

module.exports = {
    updateAgencySettings
};
