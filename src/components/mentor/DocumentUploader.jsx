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
    <div
      className="rounded-xl p-4
        bg-white dark:bg-gray-800/70
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        transition"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
            className="px-3 py-2 text-sm rounded-md
              bg-blue-600 hover:bg-blue-700
              text-white disabled:opacity-60
              transition"
          >
            {uploading ? "Uploading..." : "Upload files"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mt-3 text-sm rounded-md px-3 py-2
            bg-red-50 dark:bg-red-900/30
            text-red-600 dark:text-red-400
            border border-red-200 dark:border-red-800"
        >
          {error}
        </div>
      )}

      {/* Documents list */}
      <div className="mt-4 space-y-2">
        {docs.length === 0 && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No documents uploaded yet.
          </p>
        )}

        {docs.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between
              rounded-lg px-3 py-2
              border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-900/50
              transition"
          >
            <div>
              <p className="text-sm font-medium">{d.filename}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(d.uploadedAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => onDelete(d.id)}
              className="text-xs px-2 py-1 rounded-md
                border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
