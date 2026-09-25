# Job Application Tracker

A full-stack web application for tracking internship and job applications throughout the hiring process.

The project was built to practice full-stack software engineering with a React frontend, Flask REST API, relational database design, authentication, automated testing, and feature-based application development.

## Overview

Job searching becomes difficult to manage when applications, interviews, notes, company information, and status updates are spread across different websites and documents.

Job Application Tracker provides one place to organize and monitor the entire application process.

Users can create applications, track their progress through different stages, store important notes, manage interviews, and view detailed information about each opportunity.

## How to Run

### Start BackEnd
- py -m venv .venv
- .venv\Scripts\Activate.ps1
- python -m pip install -r requirements.txt
- python app.py

### Start the Frontend
- cd FrontEndReact
- npm install
- npm run dev
  
## Features

### Authentication

- User registration
- User login
- User logout
- Protected application data
- User-specific job applications

### Application Management

Users can:

- Create applications
- View applications
- Edit applications
- Delete applications
- Search applications
- Filter applications by status
- Store job posting URLs
- Track application dates
- Track job locations
- Track salary information
- Store job descriptions

Supported application stages include:

- Saved
- Applied
- Phone Screen
- Interview
- Offer
- Rejected
- Withdrawn

### Application Details

Each application has a dedicated detail page containing information related to that specific opportunity.

This includes:

- company information
- role information
- application status
- job description
- application progress
- interviews
- application notes
- job posting link

### Application Notes

Users can create notes associated with individual applications.

Notes can be used to track information such as:

- recruiter conversations
- follow-up reminders
- interview feedback
- company research
- important application details

### Interview Tracking

Applications can contain multiple interviews.

This allows users to track different stages of the interview process independently rather than storing a single interview date directly on the application.

### Company Management

Companies are modeled separately from applications.

This allows multiple job applications to reference the same company while keeping company-specific information in one location.

Company information can include:

- company name
- company website
- headquarters
- industry

### Dashboard

The dashboard provides a quick overview of the user's current job search.

It includes:

- total applications
- active applications
- offers
- rejected applications
- application status filtering
- application search
- recent application information

## Tech Stack

### Frontend

- React
- JavaScript
- HTML
- CSS

### Backend

- Python
- Flask
- REST APIs

### Database

- SQLAlchemy
- Relational database

### Testing

- pytest
- Flask test client
- API and backend functionality tests

### Development Tools

- Git
- GitHub
- VS Code
- Cursor
- Postman

## Future Ideas
- activity timeline
- company information enrichment
- resume management
- AI-assisted resume tailoring
- interview preparation tools
- application analytics
- notifications and follow-up reminders
- Remember Me and forgot password 

## Architecture

The application follows a full-stack architecture where React handles the user interface and communicates with a Flask backend through HTTP requests.

```text
React Frontend
      |
      | HTTP / JSON
      v
Flask REST API
      |
      v
Service / Business Logic
      |
      v
SQLAlchemy
      |
      v
Relational Database
