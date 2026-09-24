import { useState } from "react";
import FormField from "./FormField";

export default function ResumeModal({ filename, onSave, onClose }) {
  const [draft, setDraft] = useState(filename || "");

  function handleSubmit(event) {
    event.preventDefault();
    onSave(draft.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="w-full max-w-md rounded-[6px] border border-dash-rule bg-cream p-6">
        <h2
          id="resume-title"
          className="mb-4 font-display text-2xl font-semibold text-cream-ink"
        >
          Replace resume
        </h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Filename" id="resume-filename">
            <input
              id="resume-filename"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="resume.pdf"
              required
            />
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
