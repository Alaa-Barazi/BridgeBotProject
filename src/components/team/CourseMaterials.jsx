/**
 * CourseMaterials
 *
 * Displays weekly course documents uploaded by the mentor.
 * Loads materials for the selected week and allows students
 * to open or download files directly from stored data URLs.
 */

import { useEffect, useState } from "react";
import { listWeekDocuments } from "../../services/documentService";

const toStr = (v) => String(v ?? "").trim();

function safeFileName(d) {
  return (
    toStr(d?.fileName) || toStr(d?.title) || toStr(d?.filename) || "document"
  );
}

function downloadFromDataUrl(dataUrl, filename) {
  const url = toStr(dataUrl);
  if (!url || !url.startsWith("data:")) {
    alert(
      "No file data available. Ask the mentor to re-upload the document (dataUrl missing).",
    );
    return;
  }

  const name = toStr(filename) || "document";
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function CourseMaterials({ week = 1 }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr("");

      try {
        const data = await listWeekDocuments(week);
        if (!cancelled) setDocs(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled)
          setErr(String(e?.message || "Failed to load course materials."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [week]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Course Materials — Week {week}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Files uploaded by the mentor for this week.
          </p>
        </div>
      </div>

      {err && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {err}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {!loading && docs.length === 0 && (
          <p className="text-sm text-gray-500">No materials uploaded yet.</p>
        )}

        {docs.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                <span className="mr-2">📄</span>
                {safeFileName(d)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => downloadFromDataUrl(d?.dataUrl, safeFileName(d))}
              className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2 shrink-0"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
