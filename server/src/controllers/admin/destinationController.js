const { supabase } = require("../../lib/supabase");
const { parseId, pickFields } = require("../../utils/helpers");

async function listDestinations(req, res) {
    const { data, error } = await supabase
        .from("destinations")
        .select("*")
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

async function createDestination(req, res) {
    const payload = pickFields(req.body, [
        "name",
        "slug",
        "state",
        "hero_image",
        "short_description",
        "long_description",
        "best_time"
    ]);

    if (!payload.name || !payload.slug) {
        return res.status(400).json({ error: "name and slug are required." });
    }

    const { data, error } = await supabase
        .from("destinations")
        .insert([payload])
        .select("*")
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ data });
}

async function updateDestination(req, res) {
    const destinationId = parseId(req.params.id);
    if (!destinationId) {
        return res.status(400).json({ error: "Invalid destination id." });
    }

    const payload = pickFields(req.body, [
        "name",
        "slug",
        "state",
        "hero_image",
        "short_description",
        "long_description",
        "best_time"
    ]);

    if (Object.keys(payload).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    const { data, error } = await supabase
        .from("destinations")
        .update(payload)
        .eq("id", destinationId)
        .select("*")
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: "Destination not found." });
    }
    return res.json({ data });
}

async function deleteDestination(req, res) {
    const destinationId = parseId(req.params.id);
    if (!destinationId) {
        return res.status(400).json({ error: "Invalid destination id." });
    }

    const { data: destinationRow, error: destinationLookupError } = await supabase
        .from("destinations")
        .select("id")
        .eq("id", destinationId)
        .maybeSingle();

    if (destinationLookupError) {
        return res.status(500).json({ error: destinationLookupError.message });
    }
    if (!destinationRow) {
        return res.status(404).json({ error: "Destination not found." });
    }

    const { error } = await supabase.from("destinations").delete().eq("id", destinationId);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(204).send();
}

module.exports = {
    listDestinations,
    createDestination,
    updateDestination,
    deleteDestination
};
