import React, { useState } from "react";
import DocumentViewerModal from "./DocumentViewerModal";

const DocumentsSection = () => {
  const [openDoc, setOpenDoc] = useState(null);

  const documents = [
    {
      id: 1,
      title: "Requirements Document",
      updated: "2025-01-10",
      content: "This is the project requirements document preview...",
    },
    {
      id: 2,
      title: "Architecture Diagram",
      updated: "2025-01-15",
      content: "Architecture description or diagram file placeholder...",
    },
    {
      id: 3,
      title: "Project Plan",
      updated: "2025-01-12",
      content: "This is the full project plan overview...",
    },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Documents</h2>

      {/* Grid of documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setOpenDoc(doc)}
            className="cursor-pointer bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 
                       rounded-lg p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {doc.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {doc.updated}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DocumentViewerModal
        isOpen={openDoc !== null}
        onClose={() => setOpenDoc(null)}
        title={openDoc?.title}
        content={openDoc?.content}
      />
    </div>
  );
};

export default DocumentsSection;
