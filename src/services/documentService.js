let documentsByWeek = {};
let docIdCounter = 1;

function delay(result, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

// Temporary mock text extraction
function extractTextMock(file) {
  return `
Document: ${file.name}

This document contains course material related to IoT systems,
MQTT protocol, brokers, publishers, subscribers, QoS levels,
and distributed systems concepts.

(Placeholder extracted text)
`;
}

export async function uploadWeekDocuments(week, files) {
  if (!documentsByWeek[week]) documentsByWeek[week] = [];

  files.forEach((file) => {
    documentsByWeek[week].push({
      id: String(docIdCounter++),
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
      text: extractTextMock(file),
    });
  });

  return delay({ success: true });
}

export async function listWeekDocuments(week) {
  return delay(documentsByWeek[week] || []);
}

export async function deleteDocument(documentId) {
  Object.keys(documentsByWeek).forEach((week) => {
    documentsByWeek[week] = documentsByWeek[week].filter(
      (d) => d.id !== documentId
    );
  });

  return delay({ success: true });
}

// 🔴 NEW: get all text for a week
export function getWeekSourceText(week) {
  const docs = documentsByWeek[week] || [];
  return docs.map((d) => d.text).join("\n\n");
}
