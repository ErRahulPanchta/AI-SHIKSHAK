import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded bg-gray-200 disabled:opacity-50"
      >
        <FaChevronLeft />
      </button>

      <span className="font-semibold">
        Page {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded bg-gray-200 disabled:opacity-50"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;