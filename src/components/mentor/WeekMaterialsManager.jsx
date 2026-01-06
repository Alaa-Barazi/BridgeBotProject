import { useEffect, useState } from "react";
import {
  createMaterialDoc,
  deleteMaterialDoc,
  listWeekMaterials,
  updateMaterialDoc,
} from "../../services/weekMaterialsService";
import {
  deleteFileByPath,
  uploadFileToPath,
} from "../../services/storageService";
import { auth } from "../../firebase";

export default function WeekMaterialsManager() {
  const [weekId, setWeekId] = useState("week_1"); // IMPORTANT: your Firestore doc id
  const [kind, setKind] = useState("lecture");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listWeekMaterials(weekId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId]);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a file first");

    setLoading(true);
    try {
      // 1) Create Firestore doc to get materialId
      const materialId = await createMaterialDoc(weekId, {
        kind,
        title: title.trim() || file.name,
        fileName: file.name,
        uploadedBy: auth.currentUser?.uid || "",
        storagePath: "",
        downloadURL: "",
      });

      // 2) Upload file to Storage
      const storagePath = `weeks/${weekId}/materials/${materialId}/${file.name}`;
      const downloadURL = await uploadFileToPath(storagePath, file);

      // 3) Update Firestore doc with URL + path
      await updateMaterialDoc(weekId, materialId, { storagePath, downloadURL });

      setTitle("");
      setFile(null);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Upload failed (check rules).");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (m) => {
    if (!confirm("Delete this file?")) return;

    setLoading(true);
    try {
      if (m.storagePath) await deleteFileByPath(m.storagePath);
      await deleteMaterialDoc(weekId, m.id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  const onRename = async (m) => {
    const newTitle = prompt("New title:", m.title || "");
    if (!newTitle) return;

    setLoading(true);
    try {
      await updateMaterialDoc(weekId, m.id, { title: newTitle.trim() });
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Weekly Materials (Mentor)
      </h2>

      <form onSubmit={onUpload} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <input
            className="border rounded px-3 py-2 w-40"
            value={weekId}
            onChange={(e) => setWeekId(e.target.value)}
            placeholder="week_1"
          />

          <select
            className="border rounded px-3 py-2"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="lecture">Lecture</option>
            <option value="practice">Practice</option>
          </select>

          <input
            className="border rounded px-3 py-2 flex-1 min-w-55"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "Working..." : "Upload"}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {items.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {m.title}
              </div>
              <div className="text-xs text-gray-500">
                {m.kind} • {m.fileName}
              </div>
            </div>
            <div className="flex gap-3">
              {m.downloadURL && (
                <a
                  className="text-blue-600 hover:underline"
                  href={m.downloadURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              )}
              <button
                type="button"
                className="hover:underline"
                onClick={() => onRename(m)}
              >
                Update
              </button>
              <button
                type="button"
                className="text-red-600 hover:underline"
                onClick={() => onDelete(m)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-gray-500">No files yet.</div>
        )}
      </div>
    </div>
  );
}
