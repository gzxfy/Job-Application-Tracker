async function loadApplications() {
    const response = await fetch('/applications');
    const applications = await response.json();
    const databaseContainer = document.querySelector('#database-container');
    databaseContainer.innerHTML = ''; // Clear existing content

    applications.forEach(application => {
        const row = document.createElement('div');
        row.classList.add('database-row', 'database-data');     
        row.textContent = `${application.status} | ${application.company} | ${application.position} | ${application.salary} | ${application.deadline} | ${application.days_until_deadline} | ${application.job_link} | ${application.contact_name} | ${application.applied_date}`;
        databaseContainer.appendChild(row);
    });
}