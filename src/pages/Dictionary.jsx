/**
 * Dictionary Page
 * ----------------
 * Displays a weekly dictionary of technical terms for BridgeBot users.
 *
 * Features:
 * - Fetch dictionary terms by week
 * - Search by term or definition
 * - Filter by category
 * - Responsive card layout
 *
 * Dark mode design:
 * - Professional, calm, low-contrast palette
 * - No gradients, no pure white surfaces
 * - Eye-friendly for long usage
 */

import { useEffect, useState } from "react";
import DictionaryCard from "../components/common/DictionaryCard";
import Modal from "../components/common/Modal";
import { listWeekDictionary } from "../services/dictionaryService";

export default function Dictionary() {
  const userRole = "student";

  const [week, setWeek] = useState(1);
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadDictionary = async () => {
      const data = await listWeekDictionary(week);
      setTerms(data);
    };

    loadDictionary();
  }, [week]);

  const filteredTerms = terms.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-200">
        Dictionary
      </h1>

      {/* Controls */}
      <div
        className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg
                   bg-white dark:bg-[#111827]
                   border border-gray-200 dark:border-[#1f2933]
                   shadow-sm"
      >
        {/* Week selector */}
        <select
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="border rounded px-3 py-2
                     bg-white dark:bg-[#111827]
                     text-gray-900 dark:text-slate-300
                     border-gray-300 dark:border-[#1f2933]
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => (
            <option key={w} value={w}>
              {w === 1 ? "Week 1 (Syllabus)" : `Week ${w}`}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md
                     bg-white dark:bg-[#111827]
                     text-gray-900 dark:text-slate-300
                     border-gray-300 dark:border-[#1f2933]
                     placeholder-gray-400 dark:placeholder-slate-400
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />

        {/* Category filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2
                     bg-white dark:bg-[#111827]
                     text-gray-900 dark:text-slate-300
                     border-gray-300 dark:border-[#1f2933]
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="All">All categories</option>
          <option value="IoT">IoT</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg
                       bg-white dark:bg-[#111827]
                       border border-gray-200 dark:border-[#1f2933]
                       shadow-sm hover:shadow-md
                       transition-shadow"
          >
    
            <DictionaryCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
