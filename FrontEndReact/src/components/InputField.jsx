// Renders a labeled input and its optional validation message.
export default function InputField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
}) {
  // The parent owns the value and validation state for this reusable input.
  return (
    <div className="mb-5 text-left">
      <label
        htmlFor={id}
        className="mb-1.5 block font-sans text-sm font-medium text-text"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={`w-full rounded border bg-transparent px-3 py-2.5 font-sans text-base text-text outline-none transition-[border-color] duration-150 placeholder:text-text/40 ${
          error
            ? "border-error focus:border-error"
            : "border-border focus:border-accent"
        }`}
      />
      {error ? (
        <p className="mt-1.5 font-sans text-sm text-error">{error}</p>
      ) : null}
    </div>
  );
}
