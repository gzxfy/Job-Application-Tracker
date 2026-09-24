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
            <li key={note.id} className="border-b border-dash-rule py-3">
              <p className="font-sans text-xs text-dash-muted">
                {formatNoteDate(note.created_at)}
              </p>
              <p className="mt-1 font-sans text-sm text-cream-ink">{note.content}</p>
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
