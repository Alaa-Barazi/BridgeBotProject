// import { CiSearch } from "react-icons/ci";
import DictionaryCard from "../components/common/DictionaryCard";

export default function Dictionary() {
  const sampleTerms = [
    {
      term: "MQTT",
      definition: "Lightweight messaging protocol for IoT devices.",
    },
    {
      term: "NodeMCU",
      definition: "Microcontroller board used for IoT projects.",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dictionary</h1>

      {/* Search + filter section */}
      <div className="flex items-center gap-4 mb-8">
        {/* Search bar */}
        <div className="flex items-center border rounded px-3 py-2 w-full max-w-md bg-white">
          {/* <CiSearch className="text-gray-500 text-xl" /> */}
          🔍
          <input
            type="text"
            placeholder="Search terms..."
            className="ml-2 outline-none flex-1"
          />
        </div>

        {/* Filter dropdown */}
        <select className="border rounded px-3 py-2 bg-white">
          <option>All categories</option>
          <option>IoT</option>
          <option>Hardware</option>
          <option>Software</option>
        </select>
      </div>

      {/* Terms list */}
      <h3 className="text-xl font-semibold mb-4">Terms</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleTerms.map((item, index) => (
          <DictionaryCard
            key={index}
            term={item.term}
            definition={item.definition}
          />
        ))}
      </div>
    </div>
  );
}
