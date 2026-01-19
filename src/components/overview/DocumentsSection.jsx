import React, { useMemo, useState } from "react";
import DocumentViewerModal from "./DocumentViewerModal";

/**
 * Props:
 * - documents: array of docs from RTDB
 *   expected doc shape:
 *   { id, title?, fileName?, createdAt?, dataUrl?, downloadURL? }
 */
const DocumentsSection = ({ documents = [] }) => {
  const [openDoc, setOpenDoc] = useState(null);

  const docs = useMemo(
    () => (Array.isArray(documents) ? documents : []),
    [documents]
  );

  const getTitle = (d) => d?.title || d?.fileName || d?.name || "Document";
  const getUpdated = (d) => {
    const v = d?.updatedAt || d?.createdAt;
    const n =
      typeof v === "number" ? v : Number(v?.seconds ? v.seconds * 1000 : v);
    if (!Number.isFinite(n) || n <= 0) return "";
    try {
      return new Date(n).toLocaleDateString();
    } catch {
      return "";
    }
  };

  // what to open in viewer
  const getContent = (d) => d?.dataUrl || d?.downloadURL || d?.url || "";

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Documents</h2>

      {docs.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          No documents submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div
              key={doc?.id}
              className="bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700
               rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div onClick={() => setOpenDoc(doc)} className="cursor-pointer">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {getTitle(doc)}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {getUpdated(doc)
                    ? `Last updated: ${getUpdated(doc)}`
                    : "Last updated: -"}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                  onClick={(e) => {
                    e.stopPropagation(); // שלא יפתח Modal
                    downloadDoc(doc); // ✅ הורדה
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DocumentViewerModal
        isOpen={openDoc !== null}
        onClose={() => setOpenDoc(null)}
        title={getTitle(openDoc)}
        content={getContent(openDoc)}
      />
    </div>
  );
};
const downloadDoc = async (d) => {
  const url = d?.downloadURL || d?.dataUrl || d?.url || "";
  if (!url) {
    alert("No file link found.");
    return;
  }

  // שם קובץ (תני גם סיומת אם יש לך)
  const filename = (d?.fileName || d?.title || "document").trim();

  // אם זה dataUrl (base64) — הורדה ישירה
  if (url.startsWith("data:")) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  // אם זה URL רגיל — נאלץ הורדה עם blob
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch file.");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.error(e);
    // fallback: לפתוח בטאב חדש אם fetch נחסם (CORS)
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

export default DocumentsSection;
