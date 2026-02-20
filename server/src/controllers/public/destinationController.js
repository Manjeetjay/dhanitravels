const { supabase } = require("../../lib/supabase");
const { isNumeric, toNullableArray } = require("../../utils/helpers");

async function listDestinations(req, res) {
    const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("name", { ascending: true });

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

async function getDestinationDetails(req, res) {
    const { idOrSlug } = req.params;

    let destinationQuery = supabase.from("destinations").select("*").limit(1);
    if (isNumeric(idOrSlug)) {
        destinationQuery = destinationQuery.eq("id", Number(idOrSlug));
    } else {
        destinationQuery = destinationQuery.eq("slug", idOrSlug);
    }

    const { data: destinationRows, error: destinationError } = await destinationQuery;

    if (destinationError) {
        return res.status(500).json({ error: destinationError.message });
    }

    if (!destinationRows || destinationRows.length === 0) {
        return res.status(404).json({ error: "Destination not found." });
    }

    const destination = destinationRows[0];

    const [{ data: packages, error: packagesError }, { data: hotels, error: hotelsError }] =
        await Promise.all([
            supabase
                .from("packages")
                .select("*")
                .eq("destination_id", destination.id)
                .order("is_featured", { ascending: false })
                .order("price_from", { ascending: true }),
            supabase
                .from("hotels")
                .select("*")
                .eq("destination_id", destination.id)
                .order("star_rating", { ascending: false })
                .order("price_per_night", { ascending: true })
        ]);

    if (packagesError || hotelsError) {
        return res.status(500).json({
            error: packagesError?.message || hotelsError?.message
        });
    }

    const packageIds = packages.map((item) => item.id);
    let packageHotelMap = {};

    if (packageIds.length) {
        const { data: packageHotels, error: packageHotelError } = await supabase
            .from("package_hotels")
            .select("package_id, hotels(*)")
            .in("package_id", packageIds);

        if (packageHotelError) {
            return res.status(500).json({ error: packageHotelError.message });
        }

        packageHotelMap = packageHotels.reduce((acc, row) => {
            if (!acc[row.package_id]) {
                acc[row.package_id] = [];
            }
            if (row.hotels) {
                acc[row.package_id].push(row.hotels);
            }
            return acc;
        }, {});
    }

    const enrichedPackages = packages.map((item) => ({
        ...item,
        highlights: toNullableArray(item.highlights),
        hotels: packageHotelMap[item.id] || []
    }));

    return res.json({
        data: {
            ...destination,
            packages: enrichedPackages,
            hotels: hotels.map((item) => ({
                ...item,
                amenities: toNullableArray(item.amenities)
            }))
        }
    });
}

module.exports = {
    listDestinations,
    getDestinationDetails
};
