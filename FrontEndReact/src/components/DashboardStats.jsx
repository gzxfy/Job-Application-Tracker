// Shows the summary numbers calculated by the dashboard page.
export default function DashboardStats({ stats }) {
    // Stats are derived by Dashboard so this component remains presentation-only.
    return (
        <section className="mb-6 grid grid-cols-2 gap-6 border-b border-dash-rule pb-6 md:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                    <p className="mb-1 font-sans text-xs font-medium uppercase tracking-wide text-dash-muted">
                        {stat.label}
                    </p>
                    <p className="font-display text-3xl font-semibold text-cream-ink md:text-4xl">
                        {stat.value}
                    </p>
                </div>
            ))}
        </section>
    );
}