import { useEffect, useState } from "react";
import FormField from "./FormField";

const STEPS = ["Company", "Application", "Resume", "Interview"];

const STATUSES = [
  "Saved",
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const INTERVIEW_STAGES = ["Phone Screen", "Interview"];

const INTERVIEW_TYPES = ["Phone screen", "Technical", "Onsite", "Final"];

const initialDraft = {
  companyQuery: "",
  selectedCompany: null,
  website: "",
  headquarters: "",
  position: "",
  job_url: "",
  date_applied: "",
  location: "",
  work_type: "",
  salary: "",
  resumeFileName: "",
  status: "Applied",
  interviewDate: "",
  interviewTime: "",
  interviewType: "Phone screen",
  interviewer: "",
  interviewLocation: "",
  interviewNotes: "",
};

function needsInterview(status) {
  return INTERVIEW_STAGES.includes(status);
}

export default function ApplicationWizard({ onCancel, onSaved, onCreated }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [companies, setCompanies] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdCompanyId, setCreatedCompanyId] = useState(null);
  const [createdApplicationId, setCreatedApplicationId] = useState(null);

  useEffect(() => {
    if (draft.selectedCompany) return undefined;

    const query = draft.companyQuery.trim();
    if (!query) {
      return undefined;
    }

    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `/api/companies?search=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Could not search companies");
        }
        setCompanies(data);
        setError("");
      } catch (searchError) {
        setCompanies([]);
        setError(searchError.message);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [draft.companyQuery, draft.selectedCompany]);

  function updateDraft(partial) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function handleCompanyQuery(value) {
    updateDraft({
      companyQuery: value,
      selectedCompany: null,
    });
  }

  function selectCompany(company) {
    updateDraft({
      selectedCompany: company,
      companyQuery: company.name,
    });
    setCompanies([]);
  }

  const companyReady = Boolean(
    draft.selectedCompany || draft.companyQuery.trim()
  );
  const applicationReady = Boolean(draft.position.trim());
  const interviewReady =
    !needsInterview(draft.status) ||
    Boolean(draft.interviewDate && draft.interviewTime && draft.interviewType.trim());

  const canAdvance =
    (step === 0 && companyReady) ||
    (step === 1 && applicationReady) ||
    step === 2;

  async function handleFinish() {
    if (!interviewReady || loading) return;
    setLoading(true);
    setError("");

    try {
      let applicationId = createdApplicationId;

      if (!applicationId) {
        let companyId = draft.selectedCompany?.id || createdCompanyId;

        if (!companyId) {
          const companyResponse = await fetch("/api/companies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: draft.companyQuery.trim(),
              website: draft.website.trim() || null,
              headquarters: draft.headquarters.trim() || null,
            }),
          });
          const company = await companyResponse.json();
          if (!companyResponse.ok) {
            throw new Error(company.error || "Could not create company");
          }
          companyId = company.id;
          setCreatedCompanyId(company.id);
        }

        const applicationResponse = await fetch("/api/applications/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: companyId,
            position: draft.position.trim(),
            job_url: draft.job_url.trim() || null,
            status: draft.status,
            date_applied: draft.date_applied || null,
            location: draft.location.trim() || null,
            work_type: draft.work_type || null,
            salary: draft.salary.trim() ? Math.trunc(Number(draft.salary)) : null,
          }),
        });
        const application = await applicationResponse.json();
        if (!applicationResponse.ok) {
          throw new Error(application.error || "Could not create application");
        }
        applicationId = application.id;
        setCreatedApplicationId(application.id);
        onSaved?.();
      }

      if (needsInterview(draft.status)) {
        const interviewResponse = await fetch(
          `/api/applications/${applicationId}/interviews`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              interview_date: `${draft.interviewDate}T${draft.interviewTime}`,
              interview_type: draft.interviewType,
              notes: draft.interviewNotes.trim() || null,
              status: "Scheduled",
            }),
          }
        );
        const interview = await interviewResponse.json();
        if (!interviewResponse.ok) {
          throw new Error(interview.error || "Could not save interview");
        }
      }

      onCreated();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ol className="mb-6 flex items-start">
        {STEPS.map((label, index) => {
          const state =
            index === step ? "current" : index < step ? "done" : "future";
          return (
            <li key={label} className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center">
                <span
                  className={`flex h-3.5 w-3.5 shrink-0 rounded-full border ${
                    state === "current"
                      ? "border-gold bg-gold"
                      : state === "done"
                        ? "border-forest bg-forest"
                        : "border-dash-rule bg-transparent"
                  }`}
                  aria-hidden
                />
                {index < STEPS.length - 1 && (
                  <span className="h-px flex-1 bg-dash-rule" aria-hidden />
                )}
              </div>
              <span
                className={`pr-2 font-sans text-xs ${
                  state === "current"
                    ? "font-semibold text-gold"
                    : state === "done"
                      ? "text-cream-ink"
                      : "text-dash-muted"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {step === 0 && (
        <div>
          <FormField label="Company" id="wizard-company">
            <input
              id="wizard-company"
              value={draft.companyQuery}
              onChange={(event) => handleCompanyQuery(event.target.value)}
              placeholder="Search or enter a company"
              autoComplete="organization"
            />
          </FormField>

          {draft.selectedCompany ? (
            <p className="mb-4 font-sans text-sm text-cream-ink">
              Selected {draft.selectedCompany.name}
              {draft.selectedCompany.headquarters
                ? ` · ${draft.selectedCompany.headquarters}`
                : ""}
            </p>
          ) : (
            <>
              {searching && (
                <p className="mb-3 font-sans text-sm text-dash-muted">Searching…</p>
              )}
              {companies.length > 0 && (
                <ul className="mb-4 border border-dash-rule bg-white">
                  {companies.map((company) => (
                    <li key={company.id} className="border-b border-dash-rule last:border-0">
                      <button
                        type="button"
                        onClick={() => selectCompany(company)}
                        className="w-full px-3 py-2 text-left font-sans text-sm text-cream-ink hover:bg-gold/10"
                      >
                        {company.name}
                        {company.headquarters ? ` · ${company.headquarters}` : ""}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {draft.companyQuery.trim() && !searching && companies.length === 0 && (
                <p className="mb-3 font-sans text-sm text-dash-muted">
                  No matching company. Enter it as a new company.
                </p>
              )}
              <FormField label="Website" id="wizard-website">
                <input
                  id="wizard-website"
                  type="url"
                  value={draft.website}
                  onChange={(event) => updateDraft({ website: event.target.value })}
                  placeholder="https://"
                />
              </FormField>
              <FormField label="Headquarters" id="wizard-headquarters">
                <input
                  id="wizard-headquarters"
                  value={draft.headquarters}
                  onChange={(event) =>
                    updateDraft({ headquarters: event.target.value })
                  }
                />
              </FormField>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <div>
          <FormField label="Role" id="wizard-position">
            <input
              id="wizard-position"
              value={draft.position}
              onChange={(event) => updateDraft({ position: event.target.value })}
              required
            />
          </FormField>
          <FormField label="Job posting link" id="wizard-job-url">
            <input
              id="wizard-job-url"
              type="url"
              value={draft.job_url}
              onChange={(event) => updateDraft({ job_url: event.target.value })}
            />
          </FormField>
          <FormField label="Applied date" id="wizard-date-applied">
            <input
              id="wizard-date-applied"
              type="date"
              value={draft.date_applied}
              onChange={(event) => updateDraft({ date_applied: event.target.value })}
            />
          </FormField>
          <FormField label="Location" id="wizard-location">
            <input
              id="wizard-location"
              value={draft.location}
              onChange={(event) => updateDraft({ location: event.target.value })}
            />
          </FormField>
          <FormField label="Work type" id="wizard-work-type">
            <select
              id="wizard-work-type"
              value={draft.work_type}
              onChange={(event) => updateDraft({ work_type: event.target.value })}
            >
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </FormField>
          <FormField label="Salary" id="wizard-salary">
            <input
              id="wizard-salary"
              type="number"
              min="0"
              step="1"
              value={draft.salary}
              onChange={(event) => updateDraft({ salary: event.target.value })}
            />
          </FormField>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="cursor-pointer rounded-[6px] border border-dash-rule bg-white p-4">
            <span className="block font-sans text-sm font-semibold text-cream-ink">
              Import Resume
            </span>
            <span className="mt-1 block font-sans text-sm text-dash-muted">
              {draft.resumeFileName || "Choose a file"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              className="mt-3 block w-full font-sans text-sm text-cream-ink"
              onChange={(event) => {
                const file = event.target.files?.[0];
                updateDraft({ resumeFileName: file ? file.name : "" });
              }}
            />
          </label>
          <div
            className="rounded-[6px] border border-dash-rule bg-white p-4 opacity-50"
            aria-disabled="true"
          >
            <p className="font-sans text-sm font-semibold text-cream-ink">
              Tailor Resume with AI
            </p>
            <p className="mt-1 font-sans text-sm text-dash-muted">Coming soon</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <FormField label="Status" id="wizard-status">
            <select
              id="wizard-status"
              value={draft.status}
              onChange={(event) => updateDraft({ status: event.target.value })}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormField>

          {needsInterview(draft.status) && (
            <>
              <FormField label="Date" id="wizard-interview-date">
                <input
                  id="wizard-interview-date"
                  type="date"
                  value={draft.interviewDate}
                  onChange={(event) =>
                    updateDraft({ interviewDate: event.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Time" id="wizard-interview-time">
                <input
                  id="wizard-interview-time"
                  type="time"
                  value={draft.interviewTime}
                  onChange={(event) =>
                    updateDraft({ interviewTime: event.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Type" id="wizard-interview-type">
                <select
                  id="wizard-interview-type"
                  value={draft.interviewType}
                  onChange={(event) =>
                    updateDraft({ interviewType: event.target.value })
                  }
                >
                  {INTERVIEW_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Interviewer" id="wizard-interviewer">
                <input
                  id="wizard-interviewer"
                  value={draft.interviewer}
                  onChange={(event) =>
                    updateDraft({ interviewer: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Location or link" id="wizard-interview-location">
                <input
                  id="wizard-interview-location"
                  value={draft.interviewLocation}
                  onChange={(event) =>
                    updateDraft({ interviewLocation: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Notes" id="wizard-interview-notes">
                <textarea
                  id="wizard-interview-notes"
                  value={draft.interviewNotes}
                  onChange={(event) =>
                    updateDraft({ interviewNotes: event.target.value })
                  }
                  rows={3}
                  className="w-full rounded-[5px] border border-dash-rule bg-white px-3 py-2 font-sans text-sm text-cream-ink outline-none focus:border-gold"
                />
              </FormField>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 font-sans text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink"
          >
            Cancel
          </button>
          {step > 0 && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((current) => current - 1);
              }}
              className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink"
            >
              Back
            </button>
          )}
        </div>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => {
              setError("");
              setStep((current) => current + 1);
            }}
            className="rounded-[5px] border border-forest bg-forest px-4 py-2 font-sans text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-70"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={!interviewReady || loading}
            onClick={handleFinish}
            className="rounded-[5px] border border-forest bg-forest px-4 py-2 font-sans text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving…" : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}
