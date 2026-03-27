import { useState } from "react";

const RejectModal = ({ blog, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-96 space-y-4">

        <h2 className="text-lg font-semibold">
          Reject Blog
        </h2>

        <textarea
          placeholder="Enter rejection reason..."
          className="w-full border p-2 rounded"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2">

          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => onConfirm(blog._id, reason)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Reject
          </button>

        </div>

      </div>
    </div>
  );
};

export default RejectModal;