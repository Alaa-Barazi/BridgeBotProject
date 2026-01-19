// src/components/mentor/DocumentUploader.jsx
import { useEffect, useRef, useState } from "react";
import {
  uploadWeekDocuments,
  listWeekDocuments,
  deleteWeekDocument,
} from "../../services/documentService";

function TrashIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 3h6m-8 4h10m-9 0 1 15h6l1-15M10 11v7m4-7v7M6 7l1 15c.06 1.1.94 2 2.04 2h5.92c1.1 0 1.98-.9 2.04-2L20 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const toStr = (v) => String(v ?? "").trim();

function safeFileName(d) {
  return (
    toStr(d?.fileName) ||
    toStr(d?.title) ||
    toStr(d?.filename) ||
    "document"
  );
}

/**
 * ✅ Downloads the original file from dataUrl
 * - works for data:*;base64,... (what we save in RTDB)
 */
function downloadFromDataUrl(dataUrl, filename) {
  const url = toStr(dataUrl);
  if (!url || !url.startsWith("data:")) {
    alert("No file data available. Upload the document again (new version saves dataUrl).");
    return;
  }

  const name = toStr(filename) || "document";

  const a = document.createElement("a");
  a.href = url;
  a.download = name; // forces download dialog
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function DocumentUploader({ week }) {
  const inputRef = useRef(null);
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listWeekDocuments(week);
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(String(e?.message || "Failed to load documents"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week]);

  const onUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      await uploadWeekDocuments(week, Array.from(files));
      if (inputRef.current) inputRef.current.value = "";
      await refresh();
    } catch (e) {
      setError(String(e?.message || "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id) => {
    setError("");
    try {
      await deleteWeekDocument(week, id);
      // ✅ immediately remove from UI
      setDocs((prev) => prev.filter((x) => String(x?.id) !== String(id)));
    } catch (e) {
      setError(String(e?.message || "Delete failed"));
    }
  };

  const onOpen = (d) => {
    const name = safeFileName(d);
    downloadFromDataUrl(d?.dataUrl, name);
  };

  const title =
    Number(week) === 1
      ? "Upload syllabus documents (Week 1)"
      : `Upload documents for Week ${week}`;

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            These files will be used to generate quiz and dictionary.
          </p>
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.pptx,.txt"
            className="hidden"
            onChange={(e) => onUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload files"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {docs.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        )}

        {docs.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50"
          >
            {/* Left: file info */}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{safeFileName(d)}</p>
              <p className="text-xs text-gray-500">
                {d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ""}
              </p>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpen(d)}
                className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
              >
                Open
              </button>

              <button
                type="button"
                onClick={() => onDelete(d.id)}
                className="text-gray-500 hover:text-red-600"
                title="Delete"
                aria-label="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
