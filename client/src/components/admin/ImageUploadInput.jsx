import { useState } from "react";
import { adminApi } from "../../lib/api";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function ImageUploadInput({ label, value, onChange, folder, adminKey, hint }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async () => {
    if (!selectedFile) {
      setError("Select an image first.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const response = await adminApi.uploadImage(adminKey, {
        data_url: dataUrl,
        file_name: selectedFile.name,
        content_type: selectedFile.type,
        folder
      });
      onChange(response?.data?.public_url || "");
      setSelectedFile(null);
    } catch (uploadError) {
      setError(uploadError.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 sm:col-span-2">
      <span className="block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/70">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        <input
          className="form-input min-w-52 flex-1"
          placeholder="Image URL (auto-filled after upload)"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="form-input max-w-56"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        />
        <button type="button" className="btn-secondary" onClick={upload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {hint ? <p className="text-xs text-brand-charcoal/60">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export default ImageUploadInput;

