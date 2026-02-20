const crypto = require("crypto");
const path = require("path");
const { supabase } = require("../lib/supabase");

const defaultBucket = process.env.SUPABASE_STORAGE_BUCKET || "agency-images";
const maxBytes = 8 * 1024 * 1024;

const mimeToExtension = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

function sanitizeSegment(value, fallback) {
  const cleaned = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
  return cleaned || fallback;
}

function parseDataUrl(dataUrl) {
  const matched = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!matched) {
    return null;
  }
  return {
    contentType: matched[1],
    base64: matched[2]
  };
}

async function uploadImage(req, res) {
  const {
    data_url,
    base64,
    file_name,
    content_type,
    folder = "general",
    bucket = defaultBucket
  } = req.body || {};

  const parsedDataUrl = data_url ? parseDataUrl(data_url) : null;
  const finalBase64 = parsedDataUrl?.base64 || base64;
  const inferredContentType = parsedDataUrl?.contentType || content_type;

  if (!finalBase64) {
    return res.status(400).json({
      error: "data_url or base64 is required."
    });
  }

  let buffer;
  try {
    buffer = Buffer.from(finalBase64, "base64");
  } catch {
    return res.status(400).json({ error: "Invalid base64 payload." });
  }

  if (!buffer.length) {
    return res.status(400).json({ error: "Uploaded file is empty." });
  }

  if (buffer.length > maxBytes) {
    return res.status(413).json({ error: "Image too large. Max 8MB." });
  }

  const safeFolder = sanitizeSegment(folder, "general");
  const safeBucket = sanitizeSegment(bucket, defaultBucket);
  const originalExt = path.extname(String(file_name || "")).replace(".", "").toLowerCase();
  const mappedExt = mimeToExtension[inferredContentType] || "";
  const extension = originalExt || mappedExt || "jpg";

  const randomId = crypto.randomBytes(6).toString("hex");
  const storagePath = `${safeFolder}/${Date.now()}-${randomId}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(safeBucket).upload(storagePath, buffer, {
    contentType: inferredContentType || `image/${extension}`,
    upsert: false
  });

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message });
  }

  const { data: publicUrlData } = supabase.storage.from(safeBucket).getPublicUrl(storagePath);

  return res.status(201).json({
    data: {
      bucket: safeBucket,
      path: storagePath,
      public_url: publicUrlData?.publicUrl || null
    }
  });
}

module.exports = {
  uploadImage
};

