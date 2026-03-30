import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-md mx-auto mb-6 bg-white shadow-sm">
      <FaSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search blogs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full outline-none"
      />
    </div>
  );
};

export default SearchBar;