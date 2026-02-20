const { supabase } = require("../../lib/supabase");
const { parseOptionalInteger, toNullableArray } = require("../../utils/helpers");

async function listPackages(req, res) {
    const { destinationId } = req.query;
    const parsedDestinationId = parseOptionalInteger(destinationId);

    if (destinationId !== undefined && parsedDestinationId === null) {
        return res.status(400).json({
            error: "destinationId must be a positive integer."
        });
    }

    let packageQuery = supabase.from("packages").select("*");
    if (parsedDestinationId) {
        packageQuery = packageQuery.eq("destination_id", parsedDestinationId);
    }

    const { data: packages, error: packagesError } = await packageQuery
        .order("is_featured", { ascending: false })
        .order("price_from", { ascending: true });

    if (packagesError) {
        return res.status(500).json({ error: packagesError.message });
    }

    const packageRows = packages || [];
    const destinationIds = [...new Set(packageRows.map((item) => item.destination_id))];
    const packageIds = packageRows.map((item) => item.id);

    const [
        { data: destinations, error: destinationsError },
        { data: packageHotels, error: packageHotelsError }
    ] = await Promise.all([
        destinationIds.length
            ? supabase
                .from("destinations")
                .select("id, name, slug, state, hero_image")
                .in("id", destinationIds)
            : Promise.resolve({ data: [], error: null }),
        packageIds.length
            ? supabase.from("package_hotels").select("package_id, hotels(*)").in("package_id", packageIds)
            : Promise.resolve({ data: [], error: null })
    ]);

    if (destinationsError || packageHotelsError) {
        return res.status(500).json({
            error: destinationsError?.message || packageHotelsError?.message
        });
    }

    const destinationMap = (destinations || []).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});

    const packageHotelMap = (packageHotels || []).reduce((acc, row) => {
        if (!acc[row.package_id]) {
            acc[row.package_id] = [];
        }
        if (row.hotels) {
            acc[row.package_id].push(row.hotels);
        }
        return acc;
    }, {});

    const data = packageRows.map((item) => ({
        ...item,
        highlights: toNullableArray(item.highlights),
        destination: destinationMap[item.destination_id] || null,
        hotels: packageHotelMap[item.id] || []
    }));

    return res.json({
        data,
        meta: {
            count: data.length,
            empty: data.length === 0
        }
    });
}

async function getPackageDetails(req, res) {
    const { id } = req.params;
    const packageId = parseOptionalInteger(id);

    if (!packageId) {
        return res.status(400).json({ error: "Invalid package id." });
    }

    const { data: packageRows, error: packageError } = await supabase
        .from("packages")
        .select("*")
        .eq("id", packageId)
        .limit(1);

    if (packageError) {
        return res.status(500).json({ error: packageError.message });
    }

    if (!packageRows || packageRows.length === 0) {
        return res.status(404).json({ error: "Package not found." });
    }

    const packageItem = packageRows[0];

    const [
        { data: destinationRows, error: destinationError },
        { data: packageHotels, error: packageHotelError }
    ] = await Promise.all([
        supabase.from("destinations").select("*").eq("id", packageItem.destination_id).limit(1),
        supabase
            .from("package_hotels")
            .select("package_id, hotels(*)")
            .eq("package_id", packageItem.id)
    ]);

    if (destinationError || packageHotelError) {
        return res.status(500).json({
            error: destinationError?.message || packageHotelError?.message
        });
    }

    const hotels = (packageHotels || [])
        .map((row) => row.hotels)
        .filter(Boolean)
        .map((item) => ({
            ...item,
            amenities: toNullableArray(item.amenities)
        }));

    return res.json({
        data: {
            ...packageItem,
            highlights: toNullableArray(packageItem.highlights),
            destination: destinationRows?.[0] || null,
            hotels
        }
    });
}

module.exports = {
    listPackages,
    getPackageDetails
};
