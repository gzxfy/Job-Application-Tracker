import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApplicationDetailsModal from "../components/ApplicationDetailNotes";


// Loads and displays one application selected from the dashboard.
export default function ViewDetailedApplication() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false)

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
            } catch (error) {
                setError(error.message);
            }
        }
        loadApplication();
    }, [applicationId]);
   
    // Delete the current application and return to the dashboard after success.
    async function handleDelete() {
        const response = await fetch(
            `/api/applications/delete/${applicationId}`,
            { method: "DELETE" }
        );
        
        if (response.ok) {
            navigate("/dashboard");
        } else {
            setError("Could not delete application");
        }
    }
    
    if (error) {
        return (
            <main>
            <p>{error}</p>
            <Link to="/dashboard">Back to Dashboard</Link>
        </main>
        );
    }
    
    if (!application) {
        return <p>Loading application...</p>;
    }
    
    const appliedDate = application.date_applied
    ? new Date(application.date_applied).toLocaleDateString()
    : "Not provided";
    
   

    return (
        <main>
        <Link to="/dashboard">Back to Dashboard</Link>

        <h1>{application.position}</h1>
        <p>Company Name: {application.company_name}</p>

        <p>
            <strong>Status:</strong> {application.status}
        </p>

        <h2>Overview</h2>
        <p>Applied: {appliedDate}</p>

        {application.job_url && (
            <p><a href={application.job_url} target="_blank" rel="noreferrer">View Job Posting </a></p>
        )}

        <h2>Application Progress</h2>
        <p>Saved → Applied → Interview → Offer</p>

        <h2>Job Description</h2>
        <p>No job description added yet.</p>

        <p>Will add this soon</p>

        <h2>Resume</h2>
        <p>No resume attached.</p>

        <p>Generate Tailored Resume (coming soon)</p>

        <h2>Interviews</h2>
        <p>No interviews scheduled.</p>

        <p>Add Interviews (coming soon)</p>

        <h2>Notes</h2>
        <p>No notes added.</p>

        <p>Add Notes (coming soon)</p>

        <button type="button" onClick={handleDelete}>
            Delete Application
        </button>

        <button type="button" onClick={() => setShowModal(true)}>
            Add More Details
        </button>
        
        {showModal && (
            <ApplicationDetailsModal applicationId={applicationId} onClose={() => setShowModal(false)} />
        )};
    </main>
    );
}