export default function FormField({ label, id, children }) {
	return (
		<div className="form-field">
			<label htmlFor={id}>{label}</label>
			{children}
		</div>
	);
}
