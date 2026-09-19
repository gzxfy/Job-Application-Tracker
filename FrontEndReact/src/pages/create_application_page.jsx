import { useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";

// Provides the full-page version of the reusable application form.
export default function CreateApplication() {
  const navigate = useNavigate();

  return (
    <main className="min-h-svh bg-cream px-6 py-10 text-cream-ink">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 font-display text-3xl font-semibold">Add Application</h1>
        <p className="mb-6 font-sans text-sm text-dash-muted">
          Track a new job opportunity
        </p>

        <ApplicationForm
          onCancel={() => navigate("/dashboard")}
          onCreated={(application) =>
            navigate(`/applications/${application.id}`)
          }
        />
      </div>
    </main>
  );
}
