import { useState } from "react";
import FormField from "./FormField";

const WORK_TYPES = ["Remote", "Hybrid", "On-site"];

export default function OverviewModal({ location, workType, salary, onSave, onClose }) {
  const [draftLocation, setDraftLocation] = useState(location || "");
  const [draftWorkType, setDraftWorkType] = useState(workType || "");
  const [draftSalary, setDraftSalary] = useState(
    salary === null || salary === undefined ? "" : String(salary)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const workTypeOptions =
    !draftWorkType || WORK_TYPES.includes(draftWorkType)
      ? WORK_TYPES
      : [draftWorkType, ...WORK_TYPES];

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      location: draftLocation.trim(),
      work_type: draftWorkType,
    };
    const salaryText = draftSalary.trim();
    if (salaryText) {
      const amount = Math.trunc(Number(salaryText));
      if (!Number.isFinite(amount)) {
        setError("Salary must be a whole number.");
        return;
      }
      payload.salary = amount;
    }

    setSaving(true);
    setError("");
    try {
      await onSave(payload);
    } catch (saveError) {
      setError(saveError.message || "Could not save overview");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overview-title"
    >
      <div className="w-full max-w-md rounded-[6px] border border-dash-rule bg-cream p-6">
        <h2
          id="overview-title"
          className="mb-4 font-display text-2xl font-semibold text-cream-ink"
        >
          Edit overview
        </h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Location" id="overview-location">
            <input
              id="overview-location"
              value={draftLocation}
              onChange={(event) => setDraftLocation(event.target.value)}
            />
          </FormField>
          <FormField label="Work type" id="overview-work-type">
            <select
              id="overview-work-type"
              value={draftWorkType}
              onChange={(event) => setDraftWorkType(event.target.value)}
            >
              <option value="">Select</option>
              {workTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Salary" id="overview-salary">
            <input
              id="overview-salary"
              type="number"
              min="0"
              step="1"
              value={draftSalary}
              onChange={(event) => setDraftSalary(event.target.value)}
            />
          </FormField>
          {error && (
            <p className="mb-3 font-sans text-sm text-error" role="alert">
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
