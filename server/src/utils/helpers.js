/**
 * Shared helper utilities used across controllers.
 */

function parseId(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeArray(value) {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }
    if (typeof value === "string" && value.trim().length) {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function pickFields(source, fields) {
    const input = source || {};
    return fields.reduce((acc, key) => {
        if (input[key] !== undefined) {
            acc[key] = input[key];
        }
        return acc;
    }, {});
}

function isNumeric(value) {
    return /^[0-9]+$/.test(String(value));
}

function sanitizeNumber(value) {
    return String(value || "").replace(/\D/g, "");
}

function buildWhatsappUrl(messageText) {
    const whatsappNumber = sanitizeNumber(process.env.WHATSAPP_NUMBER);
    if (!whatsappNumber) {
        return null;
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
}

function toNullableArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

function parseOptionalInteger(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

module.exports = {
    parseId,
    normalizeArray,
    pickFields,
    isNumeric,
    sanitizeNumber,
    buildWhatsappUrl,
    toNullableArray,
    parseOptionalInteger
};
