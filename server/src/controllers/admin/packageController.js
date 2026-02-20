const { supabase } = require("../../lib/supabase");
const { parseId, normalizeArray, pickFields } = require("../../utils/helpers");

async function fetchPackageWithRelations(packageId) {
    const [{ data: packageRows, error: packageError }, { data: packageHotels, error: hotelError }] =
        await Promise.all([
            supabase.from("packages").select("*").eq("id", packageId).limit(1),
            supabase
                .from("package_hotels")
                .select("package_id, hotels(*)")
                .eq("package_id", packageId)
        ]);

    if (packageError || hotelError) {
        throw new Error(packageError?.message || hotelError?.message);
    }

    const packageItem = packageRows?.[0];
    if (!packageItem) {
        return null;
    }

    const hotels = (packageHotels || []).map((row) => row.hotels).filter(Boolean);
    return {
        ...packageItem,
        hotels
    };
}

async function listPackages(req, res) {
    const { data, error } = await supabase
        .from("packages")
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

async function createPackage(req, res) {
    const payload = pickFields(req.body, [
        "destination_id",
        "name",
        "slug",
        "duration_days",
        "price_from",
        "summary",
        "highlights",
        "cover_image",
        "is_featured"
    ]);

    payload.destination_id = parseId(payload.destination_id);
    payload.duration_days = payload.duration_days ? Number(payload.duration_days) : null;
    payload.price_from = payload.price_from ? Number(payload.price_from) : null;
    payload.highlights = normalizeArray(payload.highlights);
    payload.is_featured = Boolean(payload.is_featured);

    if (!payload.name || !payload.slug || !payload.destination_id) {
        return res
            .status(400)
            .json({ error: "name, slug and destination_id are required for packages." });
    }

    const { data: packageRow, error: packageError } = await supabase
        .from("packages")
        .insert([payload])
        .select("*")
        .single();

    if (packageError) {
        return res.status(500).json({ error: packageError.message });
    }

    const hotelIds = normalizeArray(req.body.hotel_ids).map((item) => parseId(item)).filter(Boolean);
    if (hotelIds.length) {
        const rows = hotelIds.map((hotelId) => ({
            package_id: packageRow.id,
            hotel_id: hotelId
        }));
        const { error: hotelMapError } = await supabase.from("package_hotels").insert(rows);
        if (hotelMapError) {
            return res.status(500).json({ error: hotelMapError.message });
        }
    }

    const data = await fetchPackageWithRelations(packageRow.id);
    return res.status(201).json({ data });
}

async function updatePackage(req, res) {
    const packageId = parseId(req.params.id);
    if (!packageId) {
        return res.status(400).json({ error: "Invalid package id." });
    }

    const payload = pickFields(req.body, [
        "destination_id",
        "name",
        "slug",
        "duration_days",
        "price_from",
        "summary",
        "highlights",
        "cover_image",
        "is_featured"
    ]);

    if (payload.destination_id !== undefined) {
        payload.destination_id = parseId(payload.destination_id);
    }
    if (payload.duration_days !== undefined) {
        payload.duration_days = payload.duration_days ? Number(payload.duration_days) : null;
    }
    if (payload.price_from !== undefined) {
        payload.price_from = payload.price_from ? Number(payload.price_from) : null;
    }
    if (payload.highlights !== undefined) {
        payload.highlights = normalizeArray(payload.highlights);
    }
    if (payload.is_featured !== undefined) {
        payload.is_featured = Boolean(payload.is_featured);
    }

    if (Object.keys(payload).length) {
        const { data: packageRow, error: packageError } = await supabase
            .from("packages")
            .update(payload)
            .eq("id", packageId)
            .select("id")
            .maybeSingle();
        if (packageError) {
            return res.status(500).json({ error: packageError.message });
        }
        if (!packageRow) {
            return res.status(404).json({ error: "Package not found." });
        }
    }

    if (req.body.hotel_ids !== undefined) {
        const hotelIds = normalizeArray(req.body.hotel_ids).map((item) => parseId(item)).filter(Boolean);
        const { error: removeError } = await supabase
            .from("package_hotels")
            .delete()
            .eq("package_id", packageId);
        if (removeError) {
            return res.status(500).json({ error: removeError.message });
        }

        if (hotelIds.length) {
            const rows = hotelIds.map((hotelId) => ({
                package_id: packageId,
                hotel_id: hotelId
            }));
            const { error: insertError } = await supabase.from("package_hotels").insert(rows);
            if (insertError) {
                return res.status(500).json({ error: insertError.message });
            }
        }
    }

    const data = await fetchPackageWithRelations(packageId);
    if (!data) {
        return res.status(404).json({ error: "Package not found." });
    }
    return res.json({ data });
}

async function deletePackage(req, res) {
    const packageId = parseId(req.params.id);
    if (!packageId) {
        return res.status(400).json({ error: "Invalid package id." });
    }

    const { data: packageRow, error: packageLookupError } = await supabase
        .from("packages")
        .select("id")
        .eq("id", packageId)
        .maybeSingle();

    if (packageLookupError) {
        return res.status(500).json({ error: packageLookupError.message });
    }
    if (!packageRow) {
        return res.status(404).json({ error: "Package not found." });
    }

    const { error } = await supabase.from("packages").delete().eq("id", packageId);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(204).send();
}

module.exports = {
    listPackages,
    createPackage,
    updatePackage,
    deletePackage
};
