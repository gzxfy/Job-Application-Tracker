import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditApplicationModal from "../components/EditApplicationModal";
import InterviewModal from "../components/InterviewModal";
import JobDescriptionModal from "../components/JobDescriptionModal";
import NotesEditor from "../components/NotesEditor";
import OverviewModal from "../components/OverviewModal";
import ResumeModal from "../components/ResumeModal";

const STATUS_PILL = {
  Applied: "bg-[#E8F0EA] text-[#3D6B4F]",
  "Phone Screen": "bg-[#E8EEF6] text-[#3D5A80]",
  Interview: "bg-[#F3EAF6] text-[#6B4C7A]",
  Offer: "bg-[#EEF5E4] text-[#4A6B2E]",
  Rejected: "bg-[#F6EBE8] text-[#8B4A3D]",
  Withdrawn: "bg-[#F0EEEA] text-[#6B6560]",
  Saved: "bg-[#F3EFE4] text-[#8A6A2F]",
};

const WORK_TYPE_PILL = {
  Remote: "bg-[#E8EEF6] text-[#3D5A80]",
  Hybrid: "bg-[#F3EFE4] text-[#8A6A2F]",
  "On-site": "bg-[#E8F0EA] text-[#3D6B4F]",
};

const PROGRESS_STAGES = ["Saved", "Applied", "Phone Screen", "Interview", "Offer"];

function formatSalary(value) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const MOCK_INTERVIEWS = [
  {
    id: 1,
    type: "Phone screen",
    scheduled_at: "2026-04-02T10:00",
    location: "https://meet.example.com/screen",
    interviewer: "Alex Chen",
    notes: "Ask about the team structure.",
    status: "Scheduled",
  },
  {
    id: 2,
    type: "Onsite",
    scheduled_at: "2026-04-16T14:30",
    location: "Austin, TX",
    interviewer: "Jordan Lee",
    notes: "Bring a portfolio walkthrough.",
    status: "Scheduled",
  },
];

function formatDate(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function stageState(stage, status) {
  const stageIndex = PROGRESS_STAGES.indexOf(stage);
  const terminal = status === "Rejected" || status === "Withdrawn";

  if (terminal) {
    return stageIndex <= PROGRESS_STAGES.indexOf("Applied") ? "done" : "future";
  }

  const currentIndex = PROGRESS_STAGES.indexOf(status);
  if (currentIndex === -1) return "future";
  if (stageIndex < currentIndex) return "done";
  if (stageIndex === currentIndex) return "current";
  return "future";
}

function Section({ title, action, children }) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-dash-rule pb-3">
        <h2 className="font-display text-2xl font-semibold text-cream-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function OverviewRow({ label, children }) {
  return (
    <div className="py-2">
      <dt className="font-sans text-xs font-medium uppercase tracking-wide text-dash-muted">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-sm text-cream-ink">{children}</dd>
    </div>
  );
}

// Loads and displays one application selected from the dashboard.
export default function ViewDetailedApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFilename, setResumeFilename] = useState("");
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [showEdit, setShowEdit] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [interviewModal, setInterviewModal] = useState(null);
  const [confirmingInterviewId, setConfirmingInterviewId] = useState(null);

  // Fetch the application identified by the URL parameter whenever it changes.
  useEffect(() => {
    async function loadApplication() {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load application");
        }

        setApplication(data);
        setJobDescription(data.job_description || "");
      } catch (loadError) {
        setError(loadError.message);
      }
    }
    loadApplication();
  }, [applicationId]);

  // Delete the current application and return to the dashboard after success.
  async function handleDelete() {
    const response = await fetch(`/api/applications/delete/${applicationId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      navigate("/dashboard");
    } else {
      setError("Could not delete application");
    }
  }

  function handleSaveInterview(record) {
    if (record.id) {
      setInterviews((current) =>
        current.map((item) => (item.id === record.id ? { ...item, ...record } : item))
      );
    } else {
      const nextId = interviews.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      setInterviews((current) => [...current, { ...record, id: nextId }]);
    }
    setInterviewModal(null);
  }

  function handleDeleteInterview(interviewId) {
    setInterviews((current) => current.filter((item) => item.id !== interviewId));
    setConfirmingInterviewId(null);
  }

  if (error && !application) {
    return (
      <main className="min-h-svh bg-cream px-6 py-10 text-cream-ink">
        <p className="font-sans text-sm text-error">{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block font-sans text-sm text-gold">
          Applications
        </Link>
      </main>
    );
  }

  if (!application) {
    return (
      <p className="min-h-svh bg-cream px-6 py-10 font-sans text-sm text-dash-muted">
        Loading application...
      </p>
    );
  }

  const appliedDate = formatDate(application.date_applied);
  const activity = [
    {
      id: "applied",
      date: appliedDate,
      text: "Application recorded.",
    },
    {
      id: "status",
      date: appliedDate,
      text: `Status set to ${application.status}.`,
    },
    {
      id: "follow-up",
      date: appliedDate,
      text: "Follow-up reminder added to the tracker.",
    },
  ];

  return (
    <main className="min-h-svh bg-cream text-cream-ink">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Link
              to="/dashboard"
              className="font-sans text-sm text-gold underline-offset-2 hover:underline"
            >
              Applications
            </Link>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-cream-ink">
              {application.position}
            </h1>
            <p className="mt-2 font-sans text-lg text-cream-ink">{application.company_name}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-block rounded-[5px] px-2 py-0.5 font-sans text-xs font-medium ${
                  STATUS_PILL[application.status] || "bg-[#F0EEEA] text-[#6B6560]"
                }`}
              >
                {application.status}
              </span>
              <span className="font-sans text-sm text-dash-muted">Applied {appliedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              className="rounded-[5px] border border-forest bg-forest px-4 py-2 font-sans text-sm font-semibold text-cream"
            >
              Edit Application
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-6 font-sans text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <Section
          title="Overview"
          action={
            <button
              type="button"
              onClick={() => setShowOverview(true)}
              className="font-sans text-sm font-medium text-gold"
            >
              Edit
            </button>
          }
        >
          <dl className="grid gap-x-10 sm:grid-cols-2">
            <OverviewRow label="Location">{application.location || "—"}</OverviewRow>
            <OverviewRow label="Work Type">
              {application.work_type ? (
                <span
                  className={`inline-block whitespace-nowrap rounded-[5px] px-2 py-0.5 text-xs font-medium ${
                    WORK_TYPE_PILL[application.work_type] || "bg-[#F0EEEA] text-[#6B6560]"
                  }`}
                >
                  {application.work_type}
                </span>
              ) : (
                "—"
              )}
            </OverviewRow>
            <OverviewRow label="Salary">{formatSalary(application.salary)}</OverviewRow>
            <OverviewRow label="Applied date">{appliedDate}</OverviewRow>
            <OverviewRow label="Job Posting">
              {application.job_url ? (
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold underline-offset-2 hover:underline"
                >
                  View posting
                </a>
              ) : (
                "—"
              )}
            </OverviewRow>
          </dl>
        </Section>

        <Section title="Application Progress">
          <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
            {PROGRESS_STAGES.map((stage, index) => {
              const state = stageState(stage, application.status);
              return (
                <li key={stage} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2">
                  <div className="flex items-center sm:w-full">
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
                    {index < PROGRESS_STAGES.length - 1 && (
                      <span className="hidden h-px flex-1 bg-dash-rule sm:block" aria-hidden />
                    )}
                  </div>
                  <span
                    className={`font-sans text-sm ${
                      state === "current"
                        ? "font-semibold text-gold"
                        : state === "done"
                          ? "text-cream-ink"
                          : "text-dash-muted"
                    }`}
                  >
                    {stage}
                  </span>
                </li>
              );
            })}
          </ol>
        </Section>

        <Section
          title="Job Description"
          action={
            <button
              type="button"
              onClick={() => setShowDescription(true)}
              className="font-sans text-sm font-medium text-gold"
            >
              Edit
            </button>
          }
        >
          <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-cream-ink">
            {jobDescription || "No job description added yet."}
          </p>
        </Section>

        <Section title="Resume">
          <p className="font-sans text-sm text-cream-ink">
            {resumeFilename || "No resume attached."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!resumeFilename}
              className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              View Resume
            </button>
            <button
              type="button"
              onClick={() => setShowResume(true)}
              className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink"
            >
              Replace Resume
            </button>
            <button
              type="button"
              disabled
              className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-dash-muted disabled:cursor-not-allowed"
            >
              Generate Tailored Resume
            </button>
          </div>
        </Section>

        <Section
          title="Interviews"
          action={
            <button
              type="button"
              onClick={() => setInterviewModal("new")}
              className="font-sans text-sm font-medium text-gold"
            >
              + Add Interview
            </button>
          }
        >
          {interviews.length === 0 ? (
            <p className="font-sans text-sm text-dash-muted">No interviews scheduled.</p>
          ) : (
            <ul>
              {interviews.map((interview) => (
                <li
                  key={interview.id}
                  className="flex items-start justify-between gap-4 border-b border-dash-rule py-4"
                >
                  <div>
                    <p className="font-sans text-sm font-medium text-cream-ink">
                      {interview.type}
                      <span className="font-normal text-dash-muted"> · {interview.status}</span>
                    </p>
                    <p className="mt-1 font-sans text-sm text-dash-muted">
                      {formatDateTime(interview.scheduled_at)}
                      {interview.location ? ` · ${interview.location}` : ""}
                    </p>
                    {interview.interviewer && (
                      <p className="mt-1 font-sans text-sm text-cream-ink">{interview.interviewer}</p>
                    )}
                    {interview.notes && (
                      <p className="mt-1 font-sans text-sm text-cream-ink">{interview.notes}</p>
                    )}
                  </div>
                  {confirmingInterviewId === interview.id ? (
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-sans text-sm text-cream-ink">
                        Delete this interview?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteInterview(interview.id)}
                        className="font-sans text-sm font-medium text-error"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingInterviewId(null)}
                        className="font-sans text-sm text-dash-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInterviewModal(interview)}
                        className="font-sans text-sm font-medium text-gold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingInterviewId(interview.id)}
                        className="font-sans text-sm font-medium text-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Notes">
          <NotesEditor applicationId={applicationId} />
        </Section>

        <Section title="Activity">
          <ul>
            {activity.map((entry) => (
              <li key={entry.id} className="flex gap-6 border-b border-dash-rule py-3">
                <span className="w-32 shrink-0 font-sans text-sm text-dash-muted">{entry.date}</span>
                <span className="font-sans text-sm text-cream-ink">{entry.text}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {showOverview && (
        <OverviewModal
          location={application.location}
          workType={application.work_type}
          salary={application.salary}
          onClose={() => setShowOverview(false)}
          onSave={async (payload) => {
            const response = await fetch(`/api/applications/update/${applicationId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || "Could not save overview");
            }
            setApplication(data);
            setShowOverview(false);
          }}
        />
      )}

      {showEdit && (
        <EditApplicationModal
          status={application.status}
          onClose={() => setShowEdit(false)}
          onSave={async (status) => {
            try {
              const response = await fetch(`/api/applications/update/${applicationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
              });
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || "Could not update application status");
              }

              setApplication(data);
              setError("");
              setShowEdit(false);
            } catch (saveError) {
              setError(saveError.message || "Could not update application status");
            }
          }}
        />
      )}

      {showDescription && (
        <JobDescriptionModal
          value={jobDescription}
          onClose={() => setShowDescription(false)}
          onSave={async (value) => {
            const response = await fetch(`/api/applications/update/${applicationId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ job_description: value }),
            });
            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Could not save job description");
            }

            setApplication(data);
            setJobDescription(data.job_description || "");
            setShowDescription(false);
          }}
        />
      )}

      {showResume && (
        <ResumeModal
          filename={resumeFilename}
          onClose={() => setShowResume(false)}
          onSave={(filename) => {
            setResumeFilename(filename);
            setShowResume(false);
          }}
        />
      )}

      {interviewModal && (
        <InterviewModal
          interview={interviewModal === "new" ? null : interviewModal}
          onClose={() => setInterviewModal(null)}
          onSave={handleSaveInterview}
        />
      )}
    </main>
  );
}
