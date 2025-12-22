import { useState } from "react";
import DocumentCard from "./DocumentCard";
import DocumentUploadCard from "./DocumentUploadCard";
import DocumentViewerModal from "../../../components/overview/DocumentViewerModal"; // reuse your modal path if different

export default function DocumentsPanel({ documents }) {
  const [open, setOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);

  const handleOpen = (doc) => {
    setActiveDoc(doc);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <DocumentUploadCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            title={doc.title}
            type={doc.type}
            updatedAt={doc.updatedAt}
            onOpen={() => handleOpen(doc)}
          />
        ))}
      </div>

      <DocumentViewerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={activeDoc?.title}
        content={activeDoc ? `Preview placeholder for: ${activeDoc.title}` : ""}
      />
    </div>
  );
}
