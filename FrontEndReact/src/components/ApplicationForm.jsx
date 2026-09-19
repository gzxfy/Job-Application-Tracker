import { useState } from "react";
import FormField from "./FormField";

export default function ApplicationForm({ onCancel, onCreated }) {
	const [formData, setFormData] = useState({
		company_id: "1",
		position: "",
		status: "Applied",
		location: "",
		work_type: "Hybrid",
		job_url: "",
		date_applied: "",
	});
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	function handleChange(event) {
		const { name, value } = event.target;
		setFormData((currentData) => ({ ...currentData, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch("/api/applications/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					company_id: Number(formData.company_id),
					position: formData.position,
					status: formData.status,
					job_url: formData.job_url,
					date_applied: formData.date_applied,
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
		<form onSubmit={handleSubmit}>
			<FormField label="Company" id="company_id">
				<select id="company_id" name="company_id" value={formData.company_id} onChange={handleChange} required>
					<option value="1">Demo Company</option>
				</select>
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
					<option value="In-person">In-person</option>
					<option value="Hybrid">Hybrid</option>
					<option value="Remote">Remote</option>
				</select>
			</FormField>

			<FormField label="Job URL" id="job_url">
				<input id="job_url" name="job_url" type="url" value={formData.job_url} onChange={handleChange} required />
			</FormField>

			<FormField label="Date Applied" id="date_applied">
				<input id="date_applied" name="date_applied" type="date" value={formData.date_applied} onChange={handleChange} required />
			</FormField>

			{message && <p role="alert">{message}</p>}
			<button type="button" onClick={onCancel}>Cancel</button>
			<button type="submit" disabled={loading}>
				{loading ? "Adding..." : "Add Application"}
			</button>
		</form>
	);
}
