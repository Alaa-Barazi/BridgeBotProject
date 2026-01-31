/**
 * DictionaryManager
 *
 * Mentor-facing component for managing the weekly dictionary.
 * Allows AI-based generation of terms from uploaded documents
 * and editing individual definitions using natural language instructions.
 */

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
    <div className="rounded-xl p-2 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
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
          className="px-3 py-2 text-sm rounded-md
            bg-emerald-600 hover:bg-emerald-700
            text-white disabled:opacity-60
            flex items-center gap-2 transition"
        >
          {generating && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {generating ? "Generating dictionary..." : "Generate dictionary"}
        </button>
      </div>

      {/* Status messages */}
      {generating && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
          BridgeBot is extracting terms from the documents
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}

      {/* Dictionary entries */}
      <div className="mt-4 space-y-2">
        {entries.map((e) => (
          <div
            key={e.id}
            className="border border-gray-200 dark:border-gray-700
              rounded-lg p-4
              bg-gray-50 dark:bg-gray-900/50
              transition"
          >
            <div className="flex gap-4 items-start">
              {/* Term + definition */}
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{e.term}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex">
                  {e.definition}
                </p>
              </div>

              {/* Action */}
              <div className="shrink-0">
                <button
                  onClick={() => setEditingId(e.id)}
                  className="text-xs px-2 py-1 rounded-md
                    border border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition whitespace-nowrap"
                >
                  Edit with AI
                </button>
              </div>
            </div>

            {editingId === e.id && (
              <div className="mt-3">
                <AICommandPanel
                  title={`Edit definition for "${e.term}"`}
                  onApply={onApplyEdit}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
