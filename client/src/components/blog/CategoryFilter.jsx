import { useEffect, useState } from "react";
import { getCategories } from "../../services/category.service";

const CategoryFilter = ({ selected, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      <button
        onClick={() => onChange("")}
        className={`px-4 py-1 rounded-full border ${
          selected === "" ? "bg-blue-500 text-white" : ""
        }`}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onChange(cat._id)}
          className={`px-4 py-1 rounded-full border ${
            selected === cat._id ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
