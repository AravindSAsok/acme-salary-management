# AI-Assisted Development Notes

## Purpose

AI tools were used as a development assistant during the implementation of the ACME Salary Management System.

The goal was to use AI to accelerate implementation and problem solving while keeping the architecture, scope, validation, testing, and final engineering decisions under developer review.

## Areas Where AI Was Used

### Product Framing

AI assistance was used to structure the initial product requirements around the HR Manager persona, including:

- Core employee salary management workflows.
- Salary summary and reporting requirements.
- Deliberately excluded functionality.
- Product and architecture trade-offs.

The final requirements were reviewed and adapted to the assessment constraints.

### Implementation

AI assistance was used for implementation guidance across:

- Node.js and Express API structure.
- SQLite database design using better-sqlite3.
- Deterministic generation of 10,000 employee records.
- React frontend structure.
- Salary update validation.
- Separation of database operations from HTTP route handling.

### Testing

AI assistance was used to identify core behaviors that should have automated coverage.

Tests were written using Node.js's built-in test runner and executed locally to verify:

- Employee dataset size.
- Required employee data.
- Salary summary calculations.
- Country-level salary summaries.
- Invalid salary handling.
- Negative salary handling.
- Unknown employee handling.

### Debugging and Development Workflow

AI assistance was also used for:

- Debugging development issues.
- Git workflow guidance.
- Project structure decisions.
- Documentation structure.
- Reviewing implementation trade-offs.

## Human Review and Verification

AI-generated suggestions were reviewed before being incorporated into the project.

The developer:

- Ran the application locally.
- Verified API responses.
- Verified the seeded dataset.
- Ran the automated test suite.
- Reviewed the Git history.
- Checked the frontend manually in the browser.
- Made final decisions about scope and implementation.

AI was therefore used as a development aid rather than as a replacement for testing or engineering review.

## Key Principle

The project intentionally avoids adding complexity simply because AI can generate it.

The implementation prioritizes:

- Clear product scope.
- Simple architecture.
- Maintainable code.
- Deterministic tests.
- Incremental development.
- Practical engineering trade-offs.