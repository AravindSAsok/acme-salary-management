# ACME Salary Management System

## 1. Goal

Build a simple web-based salary management system for ACME's HR Manager. The system replaces spreadsheet-based salary management with a centralized interface for viewing employee salary information, updating salaries, and understanding salary distribution across the organization.

The solution should remain simple, maintainable, and suitable for an organization with approximately 10,000 employees.

## 2. Scope

### Employee Management

- Display employee ID, name, email, country, department, and salary.
- Provide a searchable and usable employee salary view.
- Allow an HR Manager to update an employee's salary.
- Validate salary updates to prevent invalid or negative values.

### Salary Insights

- Show total employee count.
- Show organization-wide average salary.
- Show minimum and maximum salary.
- Show average salary and employee count by country.

### Data

- Use a relational SQLite database.
- Provide a repeatable seed script that creates 10,000 employees.
- Keep salary and employee data structured for future reporting and querying.

### Engineering Quality

- Use a React-based frontend and Node.js backend.
- Keep database operations separate from HTTP route handling.
- Include automated tests covering core salary functionality.
- Maintain an incremental Git history showing development progress.

## 3. Deliberately Excluded

The following are outside the scope of this assessment:

- Employee authentication and role-based access control.
- Payroll processing and salary payment.
- Tax, benefits, deductions, or currency conversion.
- Employee onboarding and complete HR management.
- Salary history and approval workflows.
- Notifications and email integration.
- Complex analytics and forecasting.
- Multi-tenant organization management.
- Production-grade audit logging.

## 4. Reasoning and Product Decisions

The primary persona is an HR Manager who needs a reliable alternative to maintaining salary information across spreadsheets.

The first version therefore focuses on the highest-value workflows: viewing employees, updating salaries, and answering basic questions about salary distribution.

SQLite was selected because the assessment requires a relational database and the initial dataset is only 10,000 employees. It keeps the application easy to run and deploy without introducing unnecessary infrastructure.

React with a lightweight UI was selected for the frontend, while Node.js and Express provide a straightforward API layer. The implementation avoids unnecessary complexity such as authentication, microservices, or a heavy component framework because these features do not directly contribute to the core assessment problem.

The seed script makes the 10,000-employee dataset reproducible, while automated tests provide confidence in the core database and salary operations.

The architecture is intentionally simple so that future functionality such as salary history, authentication, advanced filtering, and additional reporting can be added without requiring a complete rewrite.