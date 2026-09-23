import { useEffect, useState } from "react";

export default function NotesEditor({applicationId}) {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    
    useEffect(() => {
        async function loadNotes() {
            try {
                const response = await fetch(
                    `/api/applications/${applicationId}/notes`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error (data.error || "Could not load notes")
                }

                setNotes(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        loadNotes();
    }, [applicationId])

    async function handleCreateNote(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `/api/applications/${applicationId}/notes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({content})
                }
            );
            
            const newNote = await response.json();

            if (!response.ok) {
                throw new Error(newNote.error || "Could not create note")
            }

            setNotes((currentNotes) => [
                ...currentNotes,
                newNote,
            ]);
            setContent("");
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading notes...</p>
    }

    return (
        <section>
            <h2>Notes</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleCreateNote}>
                <textarea value={content} onChange={(event) => setContent(event.target.value)}
                                          placeholder="Write a note..." required />
                <button type="submit">Add note</button>

            </form>

            {notes.length === 0 ? (
                <p>No notes yet.</p>
            ) : (
                <ul>
                    {notes.map((note) => (
                        <li key={note.id}>
                            {note.content}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}