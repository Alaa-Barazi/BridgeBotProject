const DictionaryCard = ({ term, definition, category }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">{term}</h3>
      <p className="text-sm text-gray-700 mt-2">{definition}</p>
      <span className="text-xs text-gray-500 mt-3 inline-block">
        Category: {category}
      </span>
    </div>
  );
};

export default DictionaryCard;