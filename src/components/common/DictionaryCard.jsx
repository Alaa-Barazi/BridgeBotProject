const DictionaryCard = ({ term, definition }) => {
  return (
    <div className="bg-white rounded shadow p-4 border hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{term}</h3>
      <p className="text-gray-700">{definition}</p>
    </div>
  );
};

export default DictionaryCard;
