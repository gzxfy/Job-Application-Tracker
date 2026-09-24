// Renders status filters and the dashboard's secondary tabs.
export default function DashboardNavigation({
    statusFilters,
    filterCounts,
    selectedStatus,
    onStatusChange,
    tabs,
    activeTab,
    onTabChange,
}) {
    // The parent owns selected values; this component only renders controls and emits changes.
    return (
        <>
            <section className="mb-5 flex flex-wrap gap-2">
                {statusFilters.map((status) => {
                    const active = selectedStatus === status;
                    return (
                        <button
                            key={status}
                            type="button"
                            onClick={() => onStatusChange(status)}
                            className={`rounded-[5px] px-3 py-1.5 font-sans text-sm transition-colors ${
                                active
                                    ? "bg-gold/15 font-semibold text-gold underline decoration-2 underline-offset-4"
                                    : "text-dash-muted hover:text-cream-ink"
                            }`}
                        >
                            {status}
                            <span className="ml-1.5 tabular-nums opacity-70">
                                {filterCounts[status] ?? 0}
                            </span>
                        </button>
                    );
                })}
            </section>

            <nav className="mb-6 flex gap-6 border-b border-dash-rule">
                {tabs.map((tab) => {
                    const active = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => onTabChange(tab)}
                            className={`-mb-px border-b-2 pb-3 font-sans text-sm ${
                                active
                                    ? "border-gold font-semibold text-gold"
                                    : "border-transparent text-dash-muted hover:text-cream-ink"
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </nav>
        </>
    );
}