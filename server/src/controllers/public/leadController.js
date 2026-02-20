const { supabase } = require("../../lib/supabase");
const { parseOptionalInteger, buildWhatsappUrl } = require("../../utils/helpers");

async function submitLead(req, res) {
    const {
        full_name,
        phone,
        email,
        preferred_travel_date,
        travellers,
        budget,
        destination_id,
        package_id,
        message
    } = req.body;

    if (!full_name || !phone) {
        return res.status(400).json({
            error: "full_name and phone are required."
        });
    }

    const parsedTravellers = travellers ? Number(travellers) : null;
    const parsedBudget = budget ? Number(budget) : null;
    const parsedDestinationId = parseOptionalInteger(destination_id);
    const parsedPackageId = parseOptionalInteger(package_id);

    if (travellers !== undefined && travellers !== "" && (!Number.isInteger(parsedTravellers) || parsedTravellers <= 0)) {
        return res.status(400).json({ error: "travellers must be a positive integer." });
    }
    if (budget !== undefined && budget !== "" && (!Number.isFinite(parsedBudget) || parsedBudget < 0)) {
        return res.status(400).json({ error: "budget must be a positive number." });
    }
    if (destination_id !== undefined && destination_id !== "" && !parsedDestinationId) {
        return res.status(400).json({ error: "destination_id must be a positive integer." });
    }
    if (package_id !== undefined && package_id !== "" && !parsedPackageId) {
        return res.status(400).json({ error: "package_id must be a positive integer." });
    }

    const payload = {
        full_name: String(full_name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        preferred_travel_date: preferred_travel_date || null,
        travellers: parsedTravellers,
        budget: parsedBudget,
        destination_id: parsedDestinationId,
        package_id: parsedPackageId,
        message: message ? String(message).trim() : null,
        source: "website",
        status: "new"
    };

    if (payload.destination_id) {
        const { data: destinationRows, error: destinationLookupError } = await supabase
            .from("destinations")
            .select("id")
            .eq("id", payload.destination_id)
            .limit(1);

        if (destinationLookupError) {
            return res.status(500).json({ error: destinationLookupError.message });
        }

        if (!destinationRows?.length) {
            return res.status(400).json({ error: "Selected destination does not exist." });
        }
    }

    if (payload.package_id) {
        const { data: packageRows, error: packageLookupError } = await supabase
            .from("packages")
            .select("id, destination_id")
            .eq("id", payload.package_id)
            .limit(1);

        if (packageLookupError) {
            return res.status(500).json({ error: packageLookupError.message });
        }

        const selectedPackage = packageRows?.[0];
        if (!selectedPackage) {
            return res.status(400).json({ error: "Selected package does not exist." });
        }

        if (
            payload.destination_id &&
            Number(selectedPackage.destination_id) !== Number(payload.destination_id)
        ) {
            return res.status(400).json({
                error: "Selected package does not belong to selected destination."
            });
        }
    }

    const { data: leadRow, error: leadError } = await supabase
        .from("leads")
        .insert([payload])
        .select("*")
        .single();

    if (leadError) {
        return res.status(500).json({ error: leadError.message });
    }

    const [{ data: destinationRows }, { data: packageRows }] = await Promise.all([
        payload.destination_id
            ? supabase.from("destinations").select("name").eq("id", payload.destination_id).limit(1)
            : Promise.resolve({ data: [] }),
        payload.package_id
            ? supabase.from("packages").select("name").eq("id", payload.package_id).limit(1)
            : Promise.resolve({ data: [] })
    ]);

    const destinationName = destinationRows?.[0]?.name || "Not selected";
    const packageName = packageRows?.[0]?.name || "Not selected";

    const messageText = [
        "New Travel Inquiry",
        `Lead ID: ${leadRow.id}`,
        `Name: ${leadRow.full_name}`,
        `Phone: ${leadRow.phone}`,
        `Email: ${leadRow.email || "Not provided"}`,
        `Destination: ${destinationName}`,
        `Package: ${packageName}`,
        `Travel Date: ${leadRow.preferred_travel_date || "Flexible"}`,
        `Travellers: ${leadRow.travellers || "Not provided"}`,
        `Budget: ${leadRow.budget ? `INR ${leadRow.budget}` : "Not provided"}`,
        `Message: ${leadRow.message || "No additional message"}`
    ].join("\n");

    return res.status(201).json({
        data: {
            lead: leadRow,
            whatsapp_url: buildWhatsappUrl(messageText),
            whatsapp_message_preview: messageText
        }
    });
}

module.exports = {
    submitLead
};
