// Gives form controls a consistent label and layout wrapper.
export default function FormField({ label, id, children }) {
	// Wrapping labels and controls here keeps the application form markup consistent.
	return (
		<div className="form-field">
			<label htmlFor={id}>{label}</label>
			{children}
		</div>
	);
}
