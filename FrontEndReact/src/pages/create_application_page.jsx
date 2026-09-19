import { useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";

export default function CreateApplication() {
    const navigate = useNavigate();

    return (
        <main className="app-main add-expense-container">
            <h1>Add Application</h1>
            <p>Track a new Job Opportunity</p>

            <ApplicationForm
                onCancel={() => navigate("/dashboard")}
                onCreated={() => navigate("/dashboard")}
            />
        </main>
    )
}