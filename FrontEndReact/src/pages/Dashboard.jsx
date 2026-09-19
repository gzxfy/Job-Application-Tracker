import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");

    useEffect(() =>{
        fetch("/api/applications")
        .then(async(response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not load applications");
            }

            return data
        })
        .then(setApplications)
        .catch((error) => setError(error.message));
    }, []);

    return (
        <main>
            <h1>My Applications</h1>
            {error && <p>{error}</p>}
            {applications.map((application) => (
                <div key={application.id}>
                    <Link to={`/applications/${application.id}`}>{application.position}</Link>
                    <p>Status: {application.status}</p>
                </div>
            ))}
            <p><Link to="/applications/new">Add Application</Link></p>
        </main>
    )
}