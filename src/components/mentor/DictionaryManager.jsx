import { useEffect, useState } from "react";
import {
  generateWeekDictionary,
  listWeekDictionary,
  applyDefinitionEdit,
} from "../../services/dictionaryService";
import AICommandPanel from "./AICommandPanel";

export default function DictionaryManager({ week }) {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    const data = await listWeekDictionary(week);
    setEntries(data);
  };

  useEffect(() => {
    refresh();
  }, [week]);

  const onApplyEdit = async (instruction) => {
    const updated = await applyDefinitionEdit(editingId, instruction);
    setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
    setEditingId(null);
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold">Dictionary - Week {week}</h2>

        <button
          onClick={async () => {
            setGenerating(true);
            setError("");
            try {
              await generateWeekDictionary(week);
              await refresh();
            } catch (e) {
              setError(e.message || "Failed to generate dictionary");
            } finally {
              setGenerating(false);
            }
          }}
          disabled={generating}
          className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-md disabled:opacity-60 flex items-center gap-2"
        >
          {generating && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {generating ? "Generating dictionary..." : "Generate dictionary"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {generating && (
        <p className="text-xs text-gray-500 mt-2 italic">
          BridgeBot is extracting terms from the documents
        </p>
      )}
      <div className="mt-4 space-y-2">
        {entries.map((e) => (
          <div key={e.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-sm">{e.term}</p>
                <p className="text-sm">{e.definition}</p>
              </div>
              <button
                onClick={() => setEditingId(e.id)}
                className="text-xs border px-2 py-1 rounded-md"
              >
                Edit with AI
              </button>
            </div>

            {editingId === e.id && (
              <AICommandPanel
                title={`Edit definition for "${e.term}"`}
                onApply={onApplyEdit}
                onCancel={() => setEditingId(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
