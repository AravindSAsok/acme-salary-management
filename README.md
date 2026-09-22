# ACME Salary Management System

A web-based salary management application built for ACME's HR Manager to replace spreadsheet-based salary management with a centralized interface.

The application supports 10,000 employees and provides employee search, pagination, salary updates, and salary insights by country.

## Product Goal

The primary user is an HR Manager who needs to:

- View employee salary information.
- Search and navigate through employee records.
- Update employee salaries.
- Understand overall salary distribution.
- Compare employee counts and average salaries across countries.

The product intentionally focuses on the core salary management workflow rather than introducing unnecessary HR or payroll complexity.

## Features

### Employee Management

- View employee ID, name, email, country, department, and salary.
- Search employees by name, email, country, or department.
- Server-side pagination.
- Update employee salary.
- Validation for invalid and negative salary values.

### Salary Insights

- Total employee count.
- Average salary.
- Minimum salary.
- Maximum salary.
- Employee count by country.
- Average salary by country.

### Dataset

- SQLite relational database.
- Deterministic seed script.
- 10,000 employee records.
- Six countries.
- Five departments.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- better-sqlite3

### Database

- SQLite

### Testing

- Node.js built-in test runner

## Architecture

    React + Vite
         |
         | HTTP / JSON
         v
    Node.js + Express
         |
         v
    SQLite + better-sqlite3

Database operations are separated from HTTP route handling to keep the backend simple and maintainable.

See ARCHITECTURE.md for more details.

## Project Structure

    ASSESSMENT/
    ├── backend/
    │   ├── db.js
    │   ├── seed.js
    │   ├── server.js
    │   ├── tests/
    │   │   └── db.test.js
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── style.css
    │   └── package.json
    │
    ├── AI_NOTES.md
    ├── ARCHITECTURE.md
    ├── REQUIREMENTS.md
    └── README.md

## Requirements

- Node.js 22+
- Yarn

## Setup

Clone the repository and enter the project directory:

    git clone <repository-url>
    cd ASSESSMENT

### Backend

    cd backend
    yarn install
    yarn seed
    yarn start

The backend runs on:

    http://localhost:3001

### Frontend

Open another terminal:

    cd frontend
    yarn install
    yarn dev

The frontend runs on the Vite development server, usually:

    http://localhost:5173

## Database Seeding

The seed script creates 10,000 deterministic employee records.

    cd backend
    yarn seed

If the database already contains employee records, the seed script safely skips reseeding.

## Testing

Run the backend test suite:

    cd backend
    yarn test

The tests cover core functionality including:

- 10,000 employee dataset validation.
- Required employee fields.
- Pagination.
- Employee search.
- Salary summary calculations.
- Country-level salary summaries.
- Invalid salary validation.
- Negative salary validation.
- Unknown employee handling.

The tests are deterministic and use Node.js's built-in test runner.

## API

### Get Employees

    GET /api/employees

Supported query parameters:

    search
    page
    limit

Example:

    GET /api/employees?search=India&page=1&limit=25

### Update Salary

    PUT /api/employees/:id/salary

Request body:

    {
      "salary": 75000
    }

### Salary Summary

    GET /api/salary-summary

Returns organization-wide salary statistics and country-level salary summaries.

## Product Scope

The initial version deliberately excludes:

- Authentication and role-based access control.
- Payroll processing.
- Tax and benefits management.
- Currency conversion.
- Salary history.
- Approval workflows.
- Notifications.
- Advanced forecasting.
- Multi-tenant organization management.
- Production-grade audit logging.

These features can be considered as future extensions without changing the core architecture.

See REQUIREMENTS.md for the complete product framing and scope decisions.

## Engineering Decisions

### Why SQLite?

The assessment requires a relational database and the target dataset is 10,000 employees. SQLite provides relational querying without requiring additional database infrastructure.

### Why React + Vite?

React provides a straightforward component-based UI while Vite keeps the frontend development workflow lightweight.

### Why Express?

Express provides a small and understandable API layer without introducing unnecessary framework complexity.

### Why better-sqlite3?

It provides a simple synchronous SQLite API that works well for this assessment's dataset size and keeps database operations easy to understand.

### Why Server-Side Pagination?

The employee list is paginated and filtered at the API/database level rather than loading all 10,000 employees into the browser at once.

### Why No Heavy UI Framework?

The application uses lightweight CSS because the assessment emphasizes product functionality, maintainability, and engineering judgment rather than visual framework complexity.

## AI-Assisted Development

AI tools were used as development assistants for product framing, implementation guidance, testing ideas, debugging, and documentation.

All generated suggestions were reviewed and validated through local testing and manual verification.

See AI_NOTES.md for details.

## Development History

The Git history intentionally shows incremental development:

- Project initialization.
- Employee management and database seeding.
- Core automated tests.
- Documentation and architecture refinement.

The commit history is part of the assessment evidence for an iterative development process.

## Future Improvements

If this were extended beyond the assessment, potential improvements would include:

- Authentication and authorization.
- Salary history and audit trails.
- Database indexes for larger datasets.
- Advanced employee filtering.
- Currency-aware salary reporting.
- Production database infrastructure.
- More comprehensive API and frontend tests.
- Automated CI/CD.