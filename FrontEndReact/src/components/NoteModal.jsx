import { useState } from "react";

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteModal({ onSave, onClose, saving, error }) {
  const [content, setContent] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSave(content);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-title"
    >
      <div className="w-full max-w-md rounded-[6px] border border-dash-rule bg-cream p-6">
        <h2
          id="note-title"
          className="mb-4 font-display text-2xl font-semibold text-cream-ink"
        >
          Add note
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="note-content" className="mb-1.5 block font-sans text-sm font-medium text-cream-ink">
            Note
          </label>
          <textarea
            id="note-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={5}
            required
            placeholder="Write a note..."
            className="w-full rounded-[5px] border border-dash-rule bg-white px-3 py-2 font-sans text-sm text-cream-ink outline-none focus:border-gold"
          />
          <p className="mt-3 font-sans text-sm text-dash-muted">Date: {todayLabel()}</p>
          {error && (
            <p className="mt-3 font-sans text-sm text-error" role="alert">
              {error}
            </p>
          )}
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
              disabled={saving}
              className="rounded-[5px] border border-forest bg-forest px-4 py-2 font-sans text-sm font-semibold text-cream disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
