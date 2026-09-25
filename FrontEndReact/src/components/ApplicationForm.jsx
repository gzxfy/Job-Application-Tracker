import { useState } from "react";
import FormField from "./FormField";

// Collects a new application and sends it to the API.
export default function ApplicationForm({ onCancel, onCreated }) {
	// Keep form values local until the user submits the complete application.
	const [formData, setFormData] = useState({
		company_name: "",
		position: "",
		status: "Applied",
		location: "",
		work_type: "Hybrid",
		salary: "",
		job_url: "",
		date_applied: "",
	});
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	// Keeps every controlled input in sync with the form state by its name.
	function handleChange(event) {
		const { name, value } = event.target;
		setFormData((currentData) => ({ ...currentData, [name]: value }));
	}

	// Saves the application, reports API errors, then lets the parent refresh or navigate.
	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			// Vite proxies this relative API request to the Flask server in development.
			const response = await fetch("/api/applications/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					company_name: formData.company_name,
					position: formData.position,
					status: formData.status,
					job_url: formData.job_url,
					date_applied: formData.date_applied,
					location: formData.location.trim() || null,
					work_type: formData.work_type || null,
					salary: formData.salary.trim() ? Math.trunc(Number(formData.salary)) : null,
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Could not create application");
			}

			// Let the page navigate after the API confirms the database save.
			onCreated(result);
		} catch (error) {
			setMessage(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="application-form">
			<FormField label="Company" id="company_id">
				<input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required />
			</FormField>

			<FormField label="Position" id="position">
				<input id="position" name="position" value={formData.position} onChange={handleChange} required />
			</FormField>

			<FormField label="Status" id="status">
				<select id="status" name="status" value={formData.status} onChange={handleChange}>
					<option value="Applied">Applied</option>
					<option value="Interview">Interview</option>
					<option value="Offer">Offer</option>
					<option value="Rejected">Rejected</option>
				</select>
			</FormField>

			<FormField label="Location" id="location">
				<input id="location" name="location" value={formData.location} onChange={handleChange} required />
			</FormField>

			<FormField label="Work Type" id="work_type">
				<select id="work_type" name="work_type" value={formData.work_type} onChange={handleChange}>
					<option value="Remote">Remote</option>
					<option value="Hybrid">Hybrid</option>
					<option value="On-site">On-site</option>
				</select>
			</FormField>

			<FormField label="Salary" id="salary">
				<input id="salary" name="salary" type="number" min="0" step="1" value={formData.salary} onChange={handleChange} />
			</FormField>

			<FormField label="Job URL" id="job_url">
				<input id="job_url" name="job_url" type="url" value={formData.job_url} onChange={handleChange} required />
			</FormField>

			<FormField label="Date Applied" id="date_applied">
				<input id="date_applied" name="date_applied" type="date" value={formData.date_applied} onChange={handleChange} required />
			</FormField>

			{message && (
				<p className="mb-3 font-sans text-sm text-error" role="alert">
					{message}
				</p>
			)}
			<div className="application-form-actions">
				<button type="button" onClick={onCancel}>
					Cancel
				</button>
				<button type="submit" disabled={loading}>
					{loading ? "Saving…" : "Save Job"}
				</button>
			</div>
		</form>
	);
}
