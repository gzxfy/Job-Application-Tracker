# Job Application Tracker

A full-stack application for organizing job and internship applications, company information, interviews, and notes throughout the hiring process.

Built to practice React, Flask REST APIs, session authentication, relational database design, and automated testing. The project is under active development; some screens still contain placeholders.

## Application Workflow

1. **Register or log in.** The backend authenticates the user and stores their user ID in a Flask session.
2. **Open the dashboard.** View application counts, search by company or role, and filter applications by status.
3. **Create an application.** Use the dashboard wizard to select an existing company or create one, then enter the position, posting URL, status, applied date, location, work type, and salary. For Phone Screen or Interview status, the wizard can also save an interview through the API.
4. **View application details.** Review the job information and progress, update status and overview fields, edit the job description, and add or delete notes.
5. **Manage the application.** Return to the dashboard or delete an application from its detail page.
6. **Log out.** The backend clears the current session.

The standalone application form is also available at `/applications/new`.

## Feature Status

| Area | Current behavior |
| --- | --- |
| Authentication | Registration, login, logout, password hashing, and session-based API authentication. |
| Applications | Create, list, view, update, and delete through the API. Detail-page editing currently covers status, location, work type, salary, and job description. |
| Dashboard | Application totals, active counts, offers, rejections, text search, and status filters. |
| Companies | Search and select companies, or create one through the wizard. The API also supports reading, updating, and deleting companies. Fields include name, website, and headquarters. |
| Notes | Create, read, update, and delete through the API. The current detail screen supports viewing, adding, and deleting notes. |
| Interviews | Backend CRUD endpoints and wizard creation are implemented. The detail screen still uses mock interviews; its edits are local and are lost on refresh. |
| Resumes | UI placeholders and a draft model exist. Filename selection does not upload or persist a resume. Viewing, editing, and PDF generation are not implemented. |
| Activity and updates | Detail-page activity and dashboard updates contain sample content rather than stored events. |
| Saved Jobs and Resources | Dashboard tabs are placeholders. Saved is available as an application status in the wizard. |
| AI features | Planned after the core tracking and resume features are complete. |

Application statuses used by the interface are Saved, Applied, Phone Screen, Interview, Offer, Rejected, and Withdrawn. Available status choices currently differ between the wizard, standalone form, and dashboard filters.

## Tech Stack

- **Frontend:** React, React Router, JavaScript, Vite, Tailwind CSS.
- **Backend:** Python, Flask, Flask-SQLAlchemy, Werkzeug password hashing.
- **Database:** SQLite by default, accessed through SQLAlchemy.
- **Testing:** pytest and the Flask test client; ESLint for frontend checks.

## Local Setup

Use Python with `venv` support, Node.js, and npm. The commands below use Windows PowerShell and start from the project root.

### Backend

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create a `.env` file in the project root with a private session secret:

```dotenv
SECRET_KEY=replace-with-a-long-random-secret
```

`DATABASE_URL` is optional. When omitted, the backend uses `app.db` in the project root. If setting a SQLite URL explicitly, use an absolute path to avoid confusion about Flask's instance-relative database paths.

```powershell
python app.py
```

The development backend runs at `http://localhost:5000`. Startup creates missing tables and applies a limited set of legacy application-column updates; this is not a versioned migration system.

### Frontend

Open a second terminal:

```powershell
cd FrontEndReact
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Vite proxies `/api` requests to the Flask backend on port 5000, so keep both processes running.

These instructions run local development servers. Production hosting and routing for the built frontend are not configured here.

## Backend Architecture

```text
React frontend
      |
      | HTTP / JSON
      v
Routes
      |
      v
Services
      |
      v
Repositories
      |
      v
SQLAlchemy models / database
```

| Layer | Responsibility |
| --- | --- |
| `backend/routes/` | Parse HTTP requests, read sessions, call services, serialize responses, and choose HTTP status codes. |
| `backend/services/` | Validate input, check ownership, hash passwords, parse dates, and coordinate business workflows. |
| `backend/repositories/` | Query records, construct models, save changes, and delete records using SQLAlchemy. |
| `backend/models/` | Define database tables, columns, foreign keys, and ORM relationships. |

Routes call services, and services delegate database access to repositories. Services do not depend on Flask request or session objects. Shared repository writes roll back the database session when persistence fails.

Each repository write currently commits independently. A workflow that creates a company, application, and interview is not yet one atomic transaction. Database initialization remains in `app.py`.

### Data Relationships

- A user can own multiple applications and user-created companies.
- Each application references one user and one company.
- A company can be referenced by multiple applications. Companies without an owner are treated as global demo records.
- An application can have multiple notes and interviews.
- Each interview also stores a company reference.
- Resume storage is planned around one resume per application; the draft model is not yet integrated into the running backend.

Foreign-key declarations alone do not provide complete deletion behavior. Child-record cleanup and consistent foreign-key enforcement still need attention.

## Project Structure

```text
Job-Application-Tracker/
|-- app.py                  # Flask app factory, configuration, and startup
|-- backend/
|   |-- extensions.py       # Shared database extension
|   |-- routes/             # HTTP layer
|   |-- services/           # Business logic
|   |-- repositories/       # Database access and persistence
|   |-- models/             # Database schema
|   `-- utils/              # Validation helpers
|-- FrontEndReact/
|   `-- src/
|       |-- pages/          # Authentication, dashboard, and application pages
|       `-- components/     # Forms, wizard, modals, and display components
|-- test/                   # Backend and API tests
|-- conftest.py             # Test app, database, and login fixtures
`-- requirements.txt        # Python dependencies
```

## Verification

With the Python environment active, run backend tests from the project root:

```powershell
python -m pytest
```

Tests use an in-memory SQLite database. Importing `app.py` also constructs the default app and runs its startup schema initialization, so normal test startup can still touch the configured local database.

Run frontend checks from `FrontEndReact`:

```powershell
npm run lint
npm run build
```

## Next Steps

1. Fix deletion cleanup, company ownership checks during application updates, and missing input validation.
2. Add versioned database migrations and atomic transactions for workflows involving multiple writes.
3. Connect the interview detail screen to the existing API and align its field names with backend responses.
4. Implement private resume upload/download and one editable resume template. Store structured content for created resumes and generate PDFs as exports.
5. Add note editing in the interface, fuller application editing, real activity history, and follow-up reminders.
6. Complete Saved Jobs filtering and add password recovery, export, and pagination.
7. Explore AI-assisted resume tailoring and interview preparation after the core features work reliably.
