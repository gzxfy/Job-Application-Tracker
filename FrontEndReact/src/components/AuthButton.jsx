// Disables the submit button and changes its label while a request is pending.
export default function AuthButton({
  children,
  loading = false,
  loadingLabel,
  type = "submit",
  disabled = false,
}) {
  // A pending request always wins over the caller's disabled prop.
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className="w-full rounded border border-accent bg-accent px-4 py-2.5 font-sans text-base font-semibold text-bg transition-[transform,opacity] duration-100 ease-out enabled:active:scale-[0.98] enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? loadingLabel || "Please wait…" : children}
    </button>
  );
}
