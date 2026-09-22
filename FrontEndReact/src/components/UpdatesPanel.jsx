const STATUS_DOT = {
    Applied: "bg-[#3D6B4F]",
    Interview: "bg-[#6B4C7A]",
    Offer: "bg-[#4A6B2E]",
    Rejected: "bg-[#8B4A3D]",
};

// Displays recent activity until real update records are available.
export default function UpdatesPanel({ updates }) {
    // Updates are currently supplied by the dashboard until an activity API exists.
    return (
        <aside className="w-full shrink-0 lg:w-72">
            <h2 className="mb-4 font-display text-xl font-semibold text-cream-ink">Updates</h2>
            <ul className="space-y-4">
                {updates.map((item) => (
                    <li key={item.id} className="border-b border-dash-rule pb-4 last:border-0">
                        <div className="flex items-start gap-2.5">
                            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[item.status] || "bg-dash-muted"}`} aria-hidden />
                            <div className="min-w-0">
                                <p className="font-sans text-sm text-cream-ink">
                                    <span className="font-medium">{item.company}</span>
                                    <span className="text-dash-muted"> · {item.time}</span>
                                </p>
                                <span className="mt-2 inline-block rounded-[5px] bg-dash-rule/40 px-2 py-0.5 font-sans text-xs text-dash-muted">
                                    {item.action}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}