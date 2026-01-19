// src/components/team/project/DocumentsPanel.jsx
import { useMemo } from "react";
import DocumentUploadCard from "./DocumentUploadCard";

function toStr(v) {
  return String(v ?? "").trim();
}

function downloadDataUrl({ dataUrl, fileName = "file", contentType = "" }) {
  const url = toStr(dataUrl);
  if (!url) {
    alert("No file data found (missing dataUrl).");
    return;
  }

  // If someone stored only base64 (without prefix), rebuild a dataUrl
  const hasPrefix = url.startsWith("data:");
  const finalUrl = hasPrefix
    ? url
    : `data:${toStr(contentType) || "application/octet-stream"};base64,${url}`;

  const a = document.createElement("a");
  a.href = finalUrl;
  a.download = toStr(fileName) || "file";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function DocumentsPanel({
  documents = [],
  selectedFile,
  uploading,
  onChooseFile,
  onUpload,

  // existing helpers
  getDocTitle,
  getDocUrl,

  // ✅ NEW: delete handler from parent
  onDeleteDoc, // async (id) => {}
}) {
  const docs = useMemo(
    () => (Array.isArray(documents) ? documents : []),
    [documents]
  );

  // ✅ normalize docs to what UploadCard expects
  const filesForCard = docs.map((doc) => {
    const title = getDocTitle ? getDocTitle(doc) : doc?.title || doc?.fileName;
    const uploadedAt = doc?.updatedAt ?? doc?.createdAt ?? doc?.uploadedAt;

    return {
      ...doc,
      id: doc?.id,
      fileName: toStr(title),
      uploadedAt,
      // IMPORTANT: for download we prefer dataUrl
      dataUrl: doc?.dataUrl || (getDocUrl ? getDocUrl(doc) : doc?.url),
      contentType: doc?.contentType || doc?.mimeType || "",
    };
  });

  const handleOpenFile = (fileObj) => {
    downloadDataUrl({
      dataUrl: fileObj?.dataUrl,
      fileName: fileObj?.fileName,
      contentType: fileObj?.contentType,
    });
  };

  const handleDeleteFile = async (id) => {
    if (typeof onDeleteDoc !== "function") {
      alert("Delete handler is missing (onDeleteDoc).");
      return;
    }
    await onDeleteDoc(id);
    // אחרי מחיקה — לא צריך לעשות כלום פה אם ההורה מעדכן state (אנחנו נדאג לזה ב-Workspace)
  };

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <DocumentUploadCard
        uploading={uploading}
        selectedFile={selectedFile}
        onChooseFile={onChooseFile}
        onUpload={onUpload}
        files={filesForCard}
        onOpenFile={handleOpenFile}
        onDeleteFile={handleDeleteFile}
      />
    </div>
  );
}
