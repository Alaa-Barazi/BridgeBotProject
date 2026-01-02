import { useEffect, useState } from "react";
import DictionaryCard from "../components/common/DictionaryCard";
import Modal from "../components/common/Modal";
import { listWeekDictionary } from "../services/dictionaryService";

export default function Dictionary() {
  const userRole = "student"; // change to "teacher" for mentor view

  const [week, setWeek] = useState(1);
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    term: "",
    definition: "",
    category: "IoT",
  });

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
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Dictionary
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        {/* Week selector */}
        <select
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="border rounded px-3 py-2
                     bg-white dark:bg-gray-700
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500"
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
                     bg-white dark:bg-gray-700
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600
                     placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500"
        />

        {/* Category filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2
                     bg-white dark:bg-gray-700
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All categories</option>
          <option value="IoT">IoT</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terms.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            No dictionary cards for this week.
          </p>
        )}
        {filteredTerms.map((item, index) => (
          <div
            key={item.id || index}
            className="relative rounded-lg
                       bg-white dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       shadow-sm hover:shadow-md transition-shadow"
          >
            <DictionaryCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
