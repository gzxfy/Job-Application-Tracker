import { useState } from "react";
import NotesEditor from "./NotesEditor";

export default function ApplicationDetailsModal({applicationId, onClose}) {
    const [activeSection, setActiveSection] = useState("notes");

    return (
       <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
            role="dialog"
            aria-modal="true"
        >    
            <div className="w-full max-w-md rounded-[6px] bg-cream p-6">
                <div className="mb-4 flex justify-between">
                    <h2 className="font-display text-2xl">Add More Details</h2>
                    <button type="button" onClick={onClose}>Close</button>

                    <nav className="mb-4 flex gap-3">
                        <button type="button" onClick={() => setActiveSection("notes")}>Notes</button>
                        <button type="button" onClick={() => setActiveSection("resume")}>Resume</button>
                        <button type="button" onClick={() => setActiveSection("description")}>Job Description</button>
                    </nav>

                    {activeSection === "notes" && (
                        <NotesEditor applicationId={applicationId} />
                    )}

                    {activeSection === "resume" && (
                        <p>resume editor goes here</p>
                    )}

                    {activeSection === "description" && (
                        <textarea placeholder="Add a job description..." rows={6}></textarea>
                    )}
                    
                </div>
            </div>
        </div>
    );
};