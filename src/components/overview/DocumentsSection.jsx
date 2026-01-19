// src/components/overview/DocumentsSection.jsx
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
              onClick={() => setOpenDoc(doc)}
              className="cursor-pointer bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {getTitle(doc)}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {getUpdated(doc)
                  ? `Last updated: ${getUpdated(doc)}`
                  : "Last updated: -"}
              </p>
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

export default DocumentsSection;
