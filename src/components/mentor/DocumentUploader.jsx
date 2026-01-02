import { useEffect, useRef, useState } from "react";
import {
  uploadWeekDocuments,
  listWeekDocuments,
  deleteDocument,
} from "../../services/documentService";

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
      setDocs(data);
    } catch (e) {
      setError(e.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
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
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id) => {
    setError("");
    try {
      await deleteDocument(id);
      await refresh();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  const title =
    week === 1
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
            onClick={() => inputRef.current.click()}
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
            <div>
              <p className="text-sm font-medium">{d.filename}</p>
              <p className="text-xs text-gray-500">
                {new Date(d.uploadedAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => onDelete(d.id)}
              className="text-xs px-2 py-1 rounded-md border bg-white hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
