import { useState } from "react";
import FormField from "./FormField";

const STATUSES = [
  "Saved",
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export default function EditApplicationModal({ status, onSave, onClose }) {
  const [draftStatus, setDraftStatus] = useState(status || "Applied");

  function handleSubmit(event) {
    event.preventDefault();
    onSave(draftStatus);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-application-title"
    >
      <div className="w-full max-w-md rounded-[6px] border border-dash-rule bg-cream p-6">
        <h2
          id="edit-application-title"
          className="mb-4 font-display text-2xl font-semibold text-cream-ink"
        >
          Edit application
        </h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Status" id="edit-status">
            <select
              id="edit-status"
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value)}
            >
              {STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[5px] border border-forest bg-forest px-4 py-2 font-sans text-sm font-semibold text-cream"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
