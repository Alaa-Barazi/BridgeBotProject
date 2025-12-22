export const mockProjectNone = null;

export const mockProjectExample = {
  id: "p-101",
  projectName: "Smart Greenhouse",
  description: "IoT based environmental monitoring system",
  status: "On track", // On track | Minor issues | Delayed | Not started
  progress: 70,
  category: "IoT",
  teamLeader: "Alaa",
  members: ["Alaa", "Sara", "Omar"],
  documents: [
    { id: "d1", title: "Requirements v1", type: "PDF", updatedAt: "2025-12-21" },
    { id: "d2", title: "Architecture Notes", type: "DOC", updatedAt: "2025-12-19" },
    { id: "d3", title: "Test Plan", type: "PDF", updatedAt: "2025-12-18" },
  ],
};
