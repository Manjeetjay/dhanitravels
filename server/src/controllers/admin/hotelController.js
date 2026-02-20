const { supabase } = require("../../lib/supabase");
const { parseId, normalizeArray, pickFields } = require("../../utils/helpers");

async function listHotels(req, res) {
    const { data, error } = await supabase
        .from("hotels")
        .select("*, destinations(id, name, slug)")
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

async function createHotel(req, res) {
    const payload = pickFields(req.body, [
        "destination_id",
        "name",
        "slug",
        "star_rating",
        "price_per_night",
        "summary",
        "amenities",
        "address",
        "cover_image"
    ]);

    payload.destination_id = parseId(payload.destination_id);
    payload.star_rating = payload.star_rating ? Number(payload.star_rating) : null;
    payload.price_per_night = payload.price_per_night ? Number(payload.price_per_night) : null;
    payload.amenities = normalizeArray(payload.amenities);

    if (!payload.name || !payload.slug || !payload.destination_id) {
        return res
            .status(400)
            .json({ error: "name, slug and destination_id are required for hotels." });
    }

    const { data, error } = await supabase.from("hotels").insert([payload]).select("*").single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ data });
}

async function updateHotel(req, res) {
    const hotelId = parseId(req.params.id);
    if (!hotelId) {
        return res.status(400).json({ error: "Invalid hotel id." });
    }

    const payload = pickFields(req.body, [
        "destination_id",
        "name",
        "slug",
        "star_rating",
        "price_per_night",
        "summary",
        "amenities",
        "address",
        "cover_image"
    ]);

    if (payload.destination_id !== undefined) {
        payload.destination_id = parseId(payload.destination_id);
    }
    if (payload.star_rating !== undefined) {
        payload.star_rating = payload.star_rating ? Number(payload.star_rating) : null;
    }
    if (payload.price_per_night !== undefined) {
        payload.price_per_night = payload.price_per_night ? Number(payload.price_per_night) : null;
    }
    if (payload.amenities !== undefined) {
        payload.amenities = normalizeArray(payload.amenities);
    }

    if (Object.keys(payload).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    const { data, error } = await supabase
        .from("hotels")
        .update(payload)
        .eq("id", hotelId)
        .select("*")
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: "Hotel not found." });
    }
    return res.json({ data });
}

async function deleteHotel(req, res) {
    const hotelId = parseId(req.params.id);
    if (!hotelId) {
        return res.status(400).json({ error: "Invalid hotel id." });
    }

    const { data: hotelRow, error: hotelLookupError } = await supabase
        .from("hotels")
        .select("id")
        .eq("id", hotelId)
        .maybeSingle();

    if (hotelLookupError) {
        return res.status(500).json({ error: hotelLookupError.message });
    }
    if (!hotelRow) {
        return res.status(404).json({ error: "Hotel not found." });
    }

    const { error } = await supabase.from("hotels").delete().eq("id", hotelId);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(204).send();
}

module.exports = {
    listHotels,
    createHotel,
    updateHotel,
    deleteHotel
};
