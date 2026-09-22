# ACME Salary Management System - Architecture

## 1. Architecture Overview

The application uses a simple three-layer structure:

```text
React Frontend
      |
      | HTTP / JSON
      v
Express API
      |
      v
SQLite Database
```

The architecture is intentionally simple because the assessment focuses on product thinking, maintainable engineering, testing, and a functional salary management workflow rather than infrastructure complexity.

## 2. Frontend

**Technology:** React + Vite

The frontend provides the HR Manager interface.

Responsibilities:

- Display employee information.
- Display salary summary information.
- Allow salary editing.
- Send salary updates to the backend API.
- Present the data in a simple responsive interface.

The UI uses lightweight CSS instead of a large component framework to keep the application simple and fast.

## 3. Backend

**Technology:** Node.js + Express

The backend exposes REST-style API endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/employees` | GET | Retrieve employees |
| `/api/employees/:id/salary` | PUT | Update employee salary |
| `/api/salary-summary` | GET | Retrieve salary statistics |

Express handles HTTP requests, while database operations are separated into `db.js`.

## 4. Database

**Technology:** SQLite + better-sqlite3

The system uses one primary table:

### employees

| Column | Type | Description |
|---|---|---|
| id | INTEGER | Unique employee identifier |
| name | TEXT | Employee name |
| email | TEXT | Unique employee email |
| country | TEXT | Employee country |
| department | TEXT | Employee department |
| salary | REAL | Current salary |

The database schema is created automatically when the backend starts.

A dedicated seed script creates the required 10,000 employee records using deterministic sample data.

## 5. Data Flow

### Employee List

```text
HR Manager
    |
    v
React UI
    |
GET /api/employees
    |
    v
Express
    |
    v
db.js
    |
    v
SQLite
    |
    v
Employee JSON
    |
    v
React UI
```

### Salary Update

```text
HR Manager
    |
    v
Edit salary
    |
PUT /api/employees/:id/salary
    |
    v
Express validation
    |
    v
db.js
    |
    v
SQLite UPDATE
    |
    v
Success response
```

## 6. Salary Insights

The salary summary is calculated directly in SQLite using aggregate queries.

The system currently provides:

- Total employees
- Average salary
- Minimum salary
- Maximum salary
- Employee count by country
- Average salary by country

Using database aggregation avoids loading all records into application memory just to calculate basic statistics.

## 7. Testing Strategy

The project uses Node.js's built-in test runner.

Tests cover core behavior including:

- Employee dataset size.
- Required employee salary data.
- Overall salary summary.
- Country-level salary summary.
- Invalid salary validation.
- Negative salary validation.
- Unknown employee handling.

Tests are deterministic and do not require an external testing service.

## 8. Scalability Considerations

The current implementation is intentionally sized for the assessment requirement of 10,000 employees.

Potential future improvements for larger datasets include:

- Pagination for employee results.
- Server-side filtering and searching.
- Database indexes for frequently queried fields.
- Separate production database infrastructure.
- API authentication and authorization.
- Caching for frequently requested aggregate reports.

These are not included in the initial version because they are not required for the core HR workflow.

## 9. Security Considerations

The application uses parameterized SQLite queries for database operations, reducing SQL injection risk.

Salary values are validated before database updates.

Authentication and authorization are intentionally excluded from the assessment scope but would be required before using the application in a real production HR environment.