// src/components/team/project/ProjectNotes.jsx
import { useEffect, useMemo, useState } from "react";
import {
  subscribeProjectNotes,
  markUnreadProjectNotesRead,
} from "../../../services/notesService";

function formatDate(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  try {
    return new Date(n).toLocaleString();
  } catch {
    return "";
  }
}

export default function ProjectNotes({ projectId, teamId }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [notes, setNotes] = useState([]);
  const [unread, setUnread] = useState(0);

  const pid = useMemo(() => String(projectId || "").trim(), [projectId]);
  const tid = useMemo(() => String(teamId || "").trim(), [teamId]);

  // live notes
  useEffect(() => {
    if (!pid || !tid) return;

    const unsub = subscribeProjectNotes(pid, tid, {
      onState: (state) => {
        if (typeof state.loading === "boolean") setLoading(state.loading);
        if (state.error !== undefined) setErr(state.error || "");
        if (state.notes !== undefined)
          setNotes(Array.isArray(state.notes) ? state.notes : []);
        if (typeof state.unreadCount === "number") setUnread(state.unreadCount);
      },
    });

    return () => typeof unsub === "function" && unsub();
  }, [pid, tid]);

  /**
   * ✅ mark unread as read *with a short delay*
   * so NEW tag is visible when Notes opens.
   */
  useEffect(() => {
    if (!pid || !tid) return;
    if (loading) return;
    if (err) return;
    if (!Array.isArray(notes) || notes.length === 0) return;

    const unreadNotes = notes.filter((n) => n?.readByTeams?.[tid] !== true);
    if (unreadNotes.length === 0) return;

    const t = setTimeout(async () => {
      try {
        await markUnreadProjectNotesRead(pid, tid, unreadNotes);
      } catch (e) {
        console.error("MARK READ ERROR:", e);
      }
    }, 3000); // ✅ 3s so the UI shows NEW

    return () => clearTimeout(t);
  }, [pid, tid, loading, err, notes]);

  if (!pid || !tid) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <div className="text-sm text-gray-500">Missing project/team info</div>
      </div>
    );
  }

  if (loading) return <div className="mt-4 p-6">Loading notes...</div>;

  if (err) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="font-semibold text-gray-900 dark:text-white">Notes</div>
        <div className="mt-2 text-sm text-red-600">{err}</div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-900 dark:text-white">Notes</div>

        {unread > 0 ? (
          <div className="text-sm text-red-600">Unread: {unread}</div>
        ) : (
          <div className="text-sm text-gray-500">All caught up</div>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="mt-3 text-sm text-gray-500">No notes yet</div>
      ) : (
        <div className="mt-4 space-y-3">
          {notes.map((n) => {
            const isRead = n?.readByTeams?.[tid] === true;

            return (
              <div
                key={n?.id}
                className={[
                  "p-4 border rounded-lg",
                  isRead
                    ? "border-gray-200 dark:border-gray-700"
                    : "border-red-300 dark:border-red-700 bg-red-50/40 dark:bg-red-950/10",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Feedback on:{" "}
                      <span className="font-normal text-gray-700 dark:text-gray-200">
                        {n?.aboutDocTitle || "General"}
                      </span>
                    </div>

                    {n?.body ? (
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                        {n.body}
                      </div>
                    ) : null}

                    <div className="mt-2 text-xs text-gray-500">
                      {formatDate(n?.createdAt)}
                    </div>
                  </div>

                  {/* ✅ show NEW for unread */}
                  {!isRead && (
                    <span className="shrink-0 px-2 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
