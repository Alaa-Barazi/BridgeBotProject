import { useState } from "react";
import DictionaryCard from "../components/common/DictionaryCard";
import Modal from "../components/common/Modal";
import { iotDictionary } from "../mock/iotDictionary";

export default function Dictionary() {
  const userRole = "teacher"; // change to "student" later

  const [terms, setTerms] = useState(iotDictionary);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    term: "",
    definition: "",
    category: "IoT",
  });

  const openAddModal = () => {
    setEditingIndex(null);
    setForm({ term: "", definition: "", category: "IoT" });
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setForm(terms[index]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveTerm = () => {
    if (!form.term || !form.definition) return;

    if (editingIndex === null) {
      setTerms((prev) => [...prev, form]);
    } else {
      setTerms((prev) =>
        prev.map((item, i) => (i === editingIndex ? form : item))
      );
    }

    closeModal();
  };

  const deleteTerm = (index) => {
    if (!window.confirm("Delete this term?")) return;
    setTerms((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredTerms = terms.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dictionary</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All categories</option>
          <option value="IoT">IoT</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
        </select>

        {userRole === "teacher" && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add term
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((item, index) => (
          <div key={index} className="relative">
            <DictionaryCard {...item} />

            {userRole === "teacher" && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => openEditModal(index)}
                  className="text-xs text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTerm(index)}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <Modal
          title={editingIndex === null ? "Add term" : "Edit term"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <input
              placeholder="Term"
              value={form.term}
              onChange={(e) => setForm({ ...form, term: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              placeholder="Definition"
              value={form.definition}
              onChange={(e) => setForm({ ...form, definition: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="IoT">IoT</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={saveTerm}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
