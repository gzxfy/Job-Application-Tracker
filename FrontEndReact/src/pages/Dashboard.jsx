import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationsTable from "../components/ApplicationsTable";
import DashboardNavigation from "../components/DashboardNavigation";
import DashboardStats from "../components/DashboardStats";
import UpdatesPanel from "../components/UpdatesPanel";

const STATUS_FILTERS = [
    "All",
    "Applied",
    "Phone Screen",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
];

const TABS = ["Applications", "Saved Jobs", "Resources"];

const PLACEHOLDER_UPDATES = [
    { id: 1, company: "Northwind Labs", time: "2h ago", status: "Interview", action: "Schedule" },
    { id: 2, company: "Cedar Systems", time: "Yesterday", status: "Applied", action: "Review" },
    { id: 3, company: "Harbor Finance", time: "2d ago", status: "Offer", action: "Review" },
    { id: 4, company: "Pine & Co", time: "3d ago", status: "Rejected", action: "Review" },
];

// Counts applications for one status so the summary and filters stay consistent.
function countByStatus(applications, status) {
    return applications.filter((application) => application.status === status).length;
}

// Loads the current user's applications from the Flask API.
async function fetchApplications() {
    const response = await fetch("/api/applications");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load applications");
    return data;
}

// Owns dashboard state and combines the smaller display components.
export default function Dashboard() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Applications");
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Refreshes the list after an application is created in the modal.
    async function loadApplications() {
        try {
            const data = await fetchApplications();
            setApplications(data);
            setError("");
        } catch (loadError) {
            setError(loadError.message);
        }
    }

    // Loads applications once when the dashboard first opens.
    useEffect(() => {
        fetchApplications()
            .then(setApplications)
            .catch((loadError) => setError(loadError.message));
    }, []);

    // Derives summary counts from the applications already in state.
    const stats = useMemo(() => {
        const total = applications.length;
        const offers = countByStatus(applications, "Offer");
        const rejected = countByStatus(applications, "Rejected");
        const withdrawn = countByStatus(applications, "Withdrawn");
        return [
            { label: "Total Applications", value: total },
            { label: "Active Applications", value: Math.max(total - offers - rejected - withdrawn, 0) },
            { label: "Offers", value: offers },
            { label: "Rejected", value: rejected },
        ];
    }, [applications]);

    // Builds the numbers shown beside each status filter.
    const filterCounts = useMemo(() => {
        return Object.fromEntries(
            STATUS_FILTERS.map((status) => [
                status,
                status === "All" ? applications.length : countByStatus(applications, status),
            ])
        );
    }, [applications]);

    // Applies both the selected status and search text to the table data.
    const filteredApplications = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return applications.filter((application) => {
            const matchesStatus = statusFilter === "All" || application.status === statusFilter;
            const searchableText = `${application.company_name || ""} ${application.position || ""} ${application.status || ""}`.toLowerCase();
            return matchesStatus && (!query || searchableText.includes(query));
        });
    }, [applications, searchQuery, statusFilter]);

    // Ends the Flask session and returns the user to the login page.
    async function handleLogout() {
        try {
            await fetch("/api/logout", { method: "POST" });
        } finally {
            navigate("/login");
        }
    }

    return (
        <div className="min-h-svh bg-cream text-cream-ink">
            <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-cream-ink md:text-4xl">
                        Job Search
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <button type="button" onClick={handleLogout} className="rounded-[5px] px-2 py-2 font-sans text-sm text-dash-muted underline-offset-2 hover:text-cream-ink hover:underline">
                            Log out
                        </button>
                        <button type="button" className="rounded-[5px] border border-dash-rule bg-transparent px-4 py-2 font-sans text-sm font-medium text-cream-ink">
                            Import List
                        </button>
                        <button type="button" onClick={() => setShowCreateModal(true)} className="rounded-[5px] border border-forest bg-forest px-4 py-2 font-sans text-sm font-semibold text-cream transition-transform duration-100 active:scale-[0.98]">
                            New Application
                        </button>
                    </div>
                </header>

                <DashboardStats stats={stats} />
                <DashboardNavigation
                    statusFilters={STATUS_FILTERS}
                    filterCounts={filterCounts}
                    selectedStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {error && <p className="mb-4 font-sans text-sm text-error" role="alert">{error}</p>}

                {activeTab === "Applications" ? (
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <ApplicationsTable
                            applications={filteredApplications}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        <UpdatesPanel updates={PLACEHOLDER_UPDATES} />
                    </div>
                ) : (
                    <p className="py-12 text-center font-sans text-sm text-dash-muted">
                        {activeTab} coming soon.
                    </p>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-ink/40 p-4" role="dialog" aria-modal="true" aria-labelledby="save-job-title">
                    <div className="max-h-[90svh] w-full max-w-md overflow-y-auto rounded-[6px] border border-dash-rule bg-cream p-6 shadow-none">
                        <h2 id="save-job-title" className="mb-4 font-display text-2xl font-semibold text-cream-ink">
                            Save Job
                        </h2>
                        <ApplicationForm
                            onCancel={() => setShowCreateModal(false)}
                            onCreated={() => {
                                setShowCreateModal(false);
                                loadApplications();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}