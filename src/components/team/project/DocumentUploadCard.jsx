/**
 * DocumentUploadCard
 *
 * Reusable upload panel for project documents.
 * Supports file selection, drag-and-drop upload,
 * optimistic deletion, and opening existing files.
 */

import { useCallback, useEffect, useRef, useState } from "react";

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

function formatUploadedAt(uploadedAt) {
  if (uploadedAt == null || uploadedAt === "") return "";
  let d = null;

  if (typeof uploadedAt === "number") d = new Date(uploadedAt);

  if (!d && typeof uploadedAt === "string") {
    const ms = Date.parse(uploadedAt);
    if (!Number.isNaN(ms)) d = new Date(ms);
  }

  if (!d) d = new Date(uploadedAt);

  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function DocumentUploadCard({
  selectedFile = null,
  onChooseFile,
  onUpload,
  uploading = false,

  files = [],
  onDeleteFile, // async (id) => {}
  onOpenFile, // (fileObj) => {}
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // ✅ keep local list so UI updates immediately after delete
  const [localFiles, setLocalFiles] = useState(
    Array.isArray(files) ? files : [],
  );
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLocalFiles(Array.isArray(files) ? files : []);
  }, [files]);

  const pickFile = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  const onChoose = (file) => {
    onChooseFile?.(file || null);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0] || null;
    onChoose(file);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (uploading) return;

      const file = e.dataTransfer.files?.[0] || null;
      onChoose(file);

      if (inputRef.current) inputRef.current.value = "";
    },
    [uploading],
  );

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!uploading) setDragOver(true);
    },
    [uploading],
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (uploading) return;
    if (!selectedFile) return alert("Please choose a file first.");
    if (!onUpload) return alert("Upload handler is missing.");

    try {
      await onUpload(selectedFile);
      onChooseFile?.(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      console.error("UPLOAD CARD ERROR:", e);
      alert(String(e?.message || "Upload failed."));
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    // ✅ optimistic UI remove
    setDeletingId(String(id));
    setLocalFiles((prev) => prev.filter((x) => String(x.id) !== String(id)));

    try {
      if (typeof onDeleteFile !== "function") {
        throw new Error("Delete handler is missing in parent (onDeleteFile).");
      }
      await onDeleteFile(id);
    } catch (e) {
      // rollback if failed
      setLocalFiles(Array.isArray(files) ? files : []);
      alert(String(e?.message || "Delete failed."));
    } finally {
      setDeletingId(null);
    }
  };

  const list = Array.isArray(localFiles) ? localFiles : [];

  return (
    <div
      className={[
        "border rounded-xl p-6 transition",
        "bg-white dark:bg-[#111827]",
        "border-gray-200 dark:border-[#1f2933]",
        dragOver ? "ring-2 ring-blue-500" : "",
        uploading ? "opacity-90" : "",
      ].join(" ")}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upload a new document
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
          Upload requirements, diagrams, reports, or any supporting files.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        disabled={uploading}
      />

      <div className="mt-5 flex justify-center">
        <div
          className={[
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border",
            "border-gray-200 dark:border-[#1f2933]",
            "bg-gray-50 dark:bg-[#0b1220]",
            "text-gray-700 dark:text-slate-200",
          ].join(" ")}
        >
          <span className="opacity-80">Selected:</span>
          <span className="font-semibold">
            {selectedFile ? selectedFile.name : "No file selected"}
          </span>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500 dark:text-slate-400">
        Tip: You can also drag & drop a file here.
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={pickFile}
          disabled={uploading}
          className={[
            "px-4 py-2 rounded-lg text-sm font-semibold transition",
            "border border-gray-200 dark:border-[#1f2933]",
            "bg-white dark:bg-[#0b1220]",
            "text-gray-900 dark:text-slate-100",
            "shadow-sm",
            uploading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-gray-50 dark:hover:bg-[#0f1a2e]",
          ].join(" ")}
        >
          Choose file
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className={[
            "px-5 py-2 rounded-lg text-sm font-semibold transition",
            "bg-blue-600 text-white shadow-sm",
            uploading || !selectedFile
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-blue-700",
          ].join(" ")}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {list.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((f) => {
            const name = toStr(f.fileName || f.filename || "Untitled");
            const when = formatUploadedAt(f.uploadedAt);

            return (
              <div
                key={f.id}
                className={[
                  "border rounded-xl p-4",
                  "bg-white dark:bg-[#0b1220]",
                  "border-gray-200 dark:border-[#1f2933]",
                  "shadow-sm",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                      {name}
                    </p>
                    {when ? (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Updated {when}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        typeof onOpenFile === "function" ? onOpenFile(f) : null
                      }
                      className="text-sm underline underline-offset-2 text-blue-600 hover:text-blue-700 transition"
                    >
                      Open
                    </button>

                    {/* ✅ תמיד מוצג */}
                    <button
                      type="button"
                      onClick={() => handleDelete(f.id)}
                      disabled={
                        uploading || String(deletingId) === String(f.id)
                      }
                      className={[
                        "p-2 rounded-md transition",
                        "text-gray-500 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-[#0f1a2e]",
                        uploading || String(deletingId) === String(f.id)
                          ? "opacity-60 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Delete"
                      aria-label="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
