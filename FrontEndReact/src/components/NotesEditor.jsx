import { useEffect, useState } from "react";
import NoteModal from "./NoteModal";

function formatNoteDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotesEditor({ applicationId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch(`/api/applications/${applicationId}/notes`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load notes");
        }

        setNotes(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [applicationId]);

  async function handleCreateNote(content) {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/applications/${applicationId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const newNote = await response.json();

      if (!response.ok) {
        throw new Error(newNote.error || "Could not create note");
      }

      setNotes((currentNotes) => [newNote, ...currentNotes]);
      setShowModal(false);
    } catch (createError) {
      setError(createError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote(noteId) {
    setDeletingId(noteId);
    setError("");

    try {
      const response = await fetch(
        `/api/applications/${applicationId}/notes/${noteId}`,
        { method: "DELETE" }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not delete note");
      }

      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
      setConfirmingId(null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  const orderedNotes = [...notes].sort(
    (left, right) => new Date(right.created_at) - new Date(left.created_at)
  );

  if (loading) {
    return <p className="font-sans text-sm text-dash-muted">Loading notes...</p>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="font-sans text-sm font-medium text-gold"
        >
          + Add Note
        </button>
      </div>

      {!showModal && error && (
        <p className="mb-3 font-sans text-sm text-error" role="alert">
          {error}
        </p>
      )}

      {orderedNotes.length === 0 ? (
        <p className="font-sans text-sm text-dash-muted">No notes added.</p>
      ) : (
        <ul>
          {orderedNotes.map((note) => (
            <li key={note.id} className="flex items-start justify-between gap-4 border-b border-dash-rule py-3">
              <div>
                <p className="font-sans text-xs text-dash-muted">
                  {formatNoteDate(note.created_at)}
                </p>
                <p className="mt-1 font-sans text-sm text-cream-ink">{note.content}</p>
              </div>
              {confirmingId === note.id ? (
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-sans text-sm text-cream-ink">Delete this note?</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={deletingId === note.id}
                    className="font-sans text-sm font-medium text-error"
                  >
                    {deletingId === note.id ? "Deleting…" : "Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    className="font-sans text-sm text-dash-muted"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(note.id)}
                  className="shrink-0 font-sans text-sm font-medium text-error"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <NoteModal
          onClose={() => setShowModal(false)}
          onSave={handleCreateNote}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}
