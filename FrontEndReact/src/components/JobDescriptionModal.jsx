import { useState } from "react";

export default function JobDescriptionModal({ value, onSave, onClose }) {
  const [draft, setDraft] = useState(value || "");

  function handleSubmit(event) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-description-title"
    >
      <div className="w-full max-w-lg rounded-[6px] border border-dash-rule bg-cream p-6">
        <h2
          id="job-description-title"
          className="mb-4 font-display text-2xl font-semibold text-cream-ink"
        >
          Job description
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={8}
            placeholder="Paste the job description..."
            className="w-full rounded-[5px] border border-dash-rule bg-white px-3 py-2 font-sans text-sm text-cream-ink outline-none focus:border-gold"
          />
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
