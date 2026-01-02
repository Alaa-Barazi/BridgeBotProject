import { extractTextFromFile } from "../utils/textExtraction";

let documentsByWeek = {};
let docIdCounter = 1;

function delay(result, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function uploadWeekDocuments(week, files) {
  if (!documentsByWeek[week]) documentsByWeek[week] = [];

  for (const file of files) {
    const text = await extractTextFromFile(file);

    documentsByWeek[week].push({
      id: String(docIdCounter++),
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
      text,
    });
  }

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

export function getWeekSourceText(week) {
  const docs = documentsByWeek[week] || [];

  return docs.map((d) => `Source: ${d.filename}\n${d.text}`).join("\n\n");
}
