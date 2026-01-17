import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { fetchUsersMap } from "./authService";
import { fetchProjectsMap } from "./projectsService";
import { db } from "../firebase";
import * as XLSX from "xlsx";

export async function saveBridgeBotQA({
  studentId,
  projectId,
  question,
  answer,
}) {
  if (!studentId || !projectId || !question || !answer) {
    throw new Error("Missing required fields for BridgeBot QA save");
  }

  await addDoc(collection(db, "bridgebot_qa"), {
    studentId,
    projectId,
    question,
    answer,
    timestamp: serverTimestamp(),
  });
}

//Fetch all questions and answers
export async function fetchAllBridgeBotQA() {
  const q = query(collection(db, "bridgebot_qa"), orderBy("studentId", "asc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    studentId: doc.data().studentId,
    projectId: doc.data().projectId,
    question: doc.data().question,
    answer: doc.data().answer,
    timestamp: doc.data().timestamp?.toDate()?.toISOString() ?? "",
  }));
}
//Fetcha all questions and answers in readable format
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

//Fetch tha data into excel
export function exportReadableBridgeBotQAtoExcel(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "BridgeBot Conversations");
  XLSX.writeFile(workbook, "bridgebot_readable_conversations.xlsx");
}
