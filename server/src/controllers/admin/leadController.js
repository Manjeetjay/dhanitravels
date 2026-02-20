const { supabase } = require("../../lib/supabase");

async function listLeads(req, res) {
    const { data, error } = await supabase
        .from("leads")
        .select("*, destinations(id, name), packages(id, name)")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    const rows = data || [];
    return res.json({
        data: rows,
        meta: {
            count: rows.length,
            empty: rows.length === 0
        }
    });
}

module.exports = {
    listLeads
};
