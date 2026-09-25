import { Link } from "react-router-dom";

const STATUS_PILL = {
    Applied: "bg-[#E8F0EA] text-[#3D6B4F]",
    "Phone Screen": "bg-[#E8EEF6] text-[#3D5A80]",
    Interview: "bg-[#F3EAF6] text-[#6B4C7A]",
    Offer: "bg-[#EEF5E4] text-[#4A6B2E]",
    Rejected: "bg-[#F6EBE8] text-[#8B4A3D]",
    Withdrawn: "bg-[#F0EEEA] text-[#6B6560]",
};

const WORK_TYPE_PILL = {
    Remote: "bg-[#E8EEF6] text-[#3D5A80]",
    Hybrid: "bg-[#F3EFE4] text-[#8A6A2F]",
    "On-site": "bg-[#E8F0EA] text-[#3D6B4F]",
};

// Translate ISO timestamps from Flask into a readable dashboard date.
// Formats API date values for the dashboard table.
function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

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

// Displays the already-filtered applications and links each role to its detail page.
export default function ApplicationsTable({ applications, searchQuery, onSearchChange }) {
    return (
        <section className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search company or role..."
                    className="w-full max-w-sm rounded-[5px] border border-dash-rule bg-white px-3 py-2 font-sans text-sm text-cream-ink outline-none placeholder:text-dash-muted focus:border-gold sm:w-72"
                />
                <p className="font-sans text-sm text-dash-muted">
                    Showing {applications.length} applications
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left font-sans text-sm">
                    <thead>
                        <tr className="border-b border-dash-rule text-xs uppercase tracking-wide text-dash-muted">
                            <th className="py-2 pr-3 font-medium">Company</th>
                            <th className="py-2 pr-3 font-medium">Role</th>
                            <th className="py-2 pr-3 font-medium">Applied</th>
                            <th className="py-2 pr-3 font-medium">Status</th>
                            <th className="py-2 pr-3 font-medium">Work Type</th>
                            <th className="py-2 pr-3 font-medium">Salary</th>
                            <th className="py-2 pr-3 font-medium">Location</th>
                            <th className="py-2 pr-3 font-medium">Link</th>
                            <th className="py-2 font-medium">Next Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-8 text-center text-dash-muted">
                                    No applications to show.
                                </td>
                            </tr>
                        ) : (
                            applications.map((application) => (
                                <tr key={application.id} className="border-b border-dash-rule">
                                    <td className="py-2.5 pr-3 font-medium text-cream-ink">
                                        {application.company_name || "—"}
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        <Link
                                            to={`/applications/${application.id}`}
                                            className="text-gold underline-offset-2 hover:underline"
                                        >
                                            {application.position}
                                        </Link>
                                    </td>
                                    <td className="py-2.5 pr-3 text-dash-muted">
                                        {formatDate(application.date_applied)}
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        <span className={`inline-block whitespace-nowrap rounded-[5px] px-2 py-0.5 text-xs font-medium ${STATUS_PILL[application.status] || "bg-[#F0EEEA] text-[#6B6560]"}`}>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        {application.work_type ? (
                                            <span className={`inline-block whitespace-nowrap rounded-[5px] px-2 py-0.5 text-xs font-medium ${WORK_TYPE_PILL[application.work_type] || "bg-[#F0EEEA] text-[#6B6560]"}`}>
                                                {application.work_type}
                                            </span>
                                        ) : (
                                            <span className="text-dash-muted">—</span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap py-2.5 pr-3 text-dash-muted">
                                        {formatSalary(application.salary)}
                                    </td>
                                    <td className="py-2.5 pr-3 text-dash-muted">
                                        {application.location || "—"}
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        {application.job_url ? (
                                            <a href={application.job_url} target="_blank" rel="noreferrer" className="text-gold underline-offset-2 hover:underline">
                                                Open
                                            </a>
                                        ) : (
                                            <span className="text-dash-muted">—</span>
                                        )}
                                    </td>
                                    <td className="py-2.5 text-dash-muted">—</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}