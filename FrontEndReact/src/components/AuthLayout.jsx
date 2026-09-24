// Provides the shared two-column layout for authentication pages.
export default function AuthLayout({ title, children }) {
  // Auth pages share the same visual shell while supplying different forms.
  return (
    <div className="flex min-h-svh w-full flex-col md:flex-row">
      <section className="flex w-full flex-1 flex-col justify-center bg-bg px-8 py-12 md:w-[55%] md:px-14 lg:px-20">
        <div className="mx-auto w-full max-w-md md:mx-0">
          <h1 className="mb-8 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
            {title}
          </h1>
          {children}
        </div>
      </section>

      <aside className="flex w-full flex-col justify-center bg-surface px-8 py-12 md:w-[45%] md:px-12 lg:px-16">
        <p className="font-display text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl lg:text-6xl">
          Job Application Tracker
        </p>
        <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-text/80 md:text-lg">
          Track every application from first click to final offer—status, notes,
          and follow-ups in one place.
        </p>
      </aside>
    </div>
  );
}
