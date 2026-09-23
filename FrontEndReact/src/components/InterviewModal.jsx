import { useState } from "react";
import FormField from "./FormField";

const TYPES = ["Phone screen", "Technical", "Onsite", "Final"];
const INTERVIEW_STATUSES = ["Scheduled", "Completed", "Cancelled"];

const emptyInterview = {
  type: "Phone screen",
  scheduled_at: "",
  location: "",
  interviewer: "",
  notes: "",
  status: "Scheduled",
};

export default function InterviewModal({ interview, onSave, onClose }) {
  const [form, setForm] = useState(interview || emptyInterview);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      id: interview?.id,
      type: form.type,
      scheduled_at: form.scheduled_at,
      location: form.location,
      interviewer: form.interviewer,
      notes: form.notes,
      status: form.status,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interview-title"
    >
      <div className="max-h-[90svh] w-full max-w-md overflow-y-auto rounded-[6px] border border-dash-rule bg-cream p-6">
        <h2
          id="interview-title"
          className="mb-4 font-display text-2xl font-semibold text-cream-ink"
        >
          {interview ? "Edit interview" : "Add interview"}
        </h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Type" id="interview-type">
            <select
              id="interview-type"
              value={form.type}
              onChange={(event) => updateField("type", event.target.value)}
            >
              {TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Scheduled at" id="interview-scheduled">
            <input
              id="interview-scheduled"
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(event) => updateField("scheduled_at", event.target.value)}
              required
            />
          </FormField>

          <FormField label="Location or link" id="interview-location">
            <input
              id="interview-location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </FormField>

          <FormField label="Interviewer" id="interview-interviewer">
            <input
              id="interview-interviewer"
              value={form.interviewer}
              onChange={(event) => updateField("interviewer", event.target.value)}
            />
          </FormField>

          <FormField label="Notes" id="interview-notes">
            <textarea
              id="interview-notes"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={4}
              className="w-full rounded-[5px] border border-dash-rule bg-white px-3 py-2 font-sans text-sm text-cream-ink outline-none focus:border-gold"
            />
          </FormField>

          <FormField label="Status" id="interview-status">
            <select
              id="interview-status"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {INTERVIEW_STATUSES.map((option) => (
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
