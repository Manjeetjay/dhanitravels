const { supabase } = require("../../lib/supabase");
const { parseOptionalInteger, toNullableArray } = require("../../utils/helpers");

async function listHotels(req, res) {
    const { destinationId } = req.query;
    const parsedDestinationId = parseOptionalInteger(destinationId);

    if (destinationId !== undefined && parsedDestinationId === null) {
        return res.status(400).json({
            error: "destinationId must be a positive integer."
        });
    }

    let hotelQuery = supabase.from("hotels").select("*");
    if (parsedDestinationId) {
        hotelQuery = hotelQuery.eq("destination_id", parsedDestinationId);
    }

    const { data: hotels, error: hotelsError } = await hotelQuery
        .order("star_rating", { ascending: false })
        .order("price_per_night", { ascending: true });

    if (hotelsError) {
        return res.status(500).json({ error: hotelsError.message });
    }

    const hotelRows = hotels || [];
    const destinationIds = [...new Set(hotelRows.map((item) => item.destination_id))];
    const { data: destinations, error: destinationsError } = destinationIds.length
        ? await supabase.from("destinations").select("id, name, slug, state").in("id", destinationIds)
        : { data: [], error: null };

    if (destinationsError) {
        return res.status(500).json({ error: destinationsError.message });
    }

    const destinationMap = (destinations || []).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});

    const data = hotelRows.map((item) => ({
        ...item,
        amenities: toNullableArray(item.amenities),
        destination: destinationMap[item.destination_id] || null
    }));

    return res.json({
        data,
        meta: {
            count: data.length,
            empty: data.length === 0
        }
    });
}

module.exports = {
    listHotels
};
