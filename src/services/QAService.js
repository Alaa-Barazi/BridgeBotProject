/**
 * bridgeBotQAService
 *
 * Handles persistence, aggregation, and export of BridgeBot Q&A interactions.
 *
 * Responsibilities:
 * - Save student questions and AI answers to RTDB
 * - Fetch raw Q&A records
 * - Enrich Q&A with readable student and project names
 * - Export conversations to Excel for mentor review and analysis
 *
 * Data model (RTDB):
 * /bridgebot_qa/{qaId}
 *   - studentId
 *   - projectId
 *   - question
 *   - answer
 *   - timestamp
 *
 * Notes:
 * - User names are resolved via authService (users map)
 * - Project names are resolved via projectsService (projects map)
 * - Excel export is intended for mentor dashboards and reports
 */

import { ref, push, get, child, serverTimestamp } from "firebase/database";
import { rtdb } from "../firebase";
import { fetchUsersMap } from "./authService";
import { fetchProjectsMap } from "./projectsService";
import * as XLSX from "xlsx";

/* =========================
   Save BridgeBot QA
========================= */
export async function saveBridgeBotQA({
  studentId,
  projectId,
  question,
  answer,
}) {
  if (!studentId || !projectId || !question || !answer) {
    throw new Error("Missing required fields for BridgeBot QA save");
  }

  const qaRef = ref(rtdb, "bridgebot_qa");

  await push(qaRef, {
    studentId,
    projectId,
    question,
    answer,
    timestamp: serverTimestamp(),
  });
}

/* =========================
   Fetch all Q&A
========================= */
export async function fetchAllBridgeBotQA() {
  const snapshot = await get(child(ref(rtdb), "bridgebot_qa"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.values(data)
    .sort((a, b) => (a.studentId || "").localeCompare(b.studentId || ""))
    .map((row) => ({
      studentId: row.studentId,
      projectId: row.projectId,
      question: row.question,
      answer: row.answer,
      timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : "",
    }));
}

/* =========================
   Fetch readable Q&A
========================= */
export async function fetchAllBridgeBotQAReadable() {
  const [qaRows, usersMap, projectsMap] = await Promise.all([
    fetchAllBridgeBotQA(),
    fetchUsersMap(),
    fetchProjectsMap(),
  ]);

  return qaRows.map((row) => ({
    studentName: usersMap[row.studentId] ?? row.studentId,
    projectName: projectsMap[row.projectId] ?? row.projectId,
    question: row.question,
    answer: row.answer,
    timestamp: row.timestamp,
  }));
}

/* =========================
   Export to Excel
========================= */
export function exportReadableBridgeBotQAtoExcel(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "BridgeBot Conversations");

  XLSX.writeFile(workbook, "bridgebot_readable_conversations.xlsx");
}
