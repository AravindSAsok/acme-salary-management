const Database = require("better-sqlite3");

const db = new Database("acme.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL
  )
`);

function getEmployees({ search = "", page = 1, limit = 25 } = {}) {
  const normalizedPage = Math.max(1, Number(page) || 1);
  const normalizedLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 25)
  );
  const offset = (normalizedPage - 1) * normalizedLimit;

  const searchTerm = `%${search.trim()}%`;

  const countResult = db
    .prepare(`
      SELECT COUNT(*) AS total
      FROM employees
      WHERE
        name LIKE ?
        OR email LIKE ?
        OR country LIKE ?
        OR department LIKE ?
    `)
    .get(searchTerm, searchTerm, searchTerm, searchTerm);

  const employees = db
    .prepare(`
      SELECT *
      FROM employees
      WHERE
        name LIKE ?
        OR email LIKE ?
        OR country LIKE ?
        OR department LIKE ?
      ORDER BY id
      LIMIT ? OFFSET ?
    `)
    .all(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      normalizedLimit,
      offset
    );

  return {
    employees,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / normalizedLimit),
    },
  };
}

function updateSalary(id, salary) {
  if (!Number.isFinite(salary) || salary < 0) {
    return { error: "Invalid salary" };
  }

  const result = db
    .prepare("UPDATE employees SET salary = ? WHERE id = ?")
    .run(salary, id);

  if (result.changes === 0) {
    return { error: "Employee not found" };
  }

  return { message: "Salary updated" };
}

function getSalarySummary() {
  const overall = db
    .prepare(`
      SELECT
        COUNT(*) AS employees,
        ROUND(AVG(salary), 2) AS averageSalary,
        MIN(salary) AS minimumSalary,
        MAX(salary) AS maximumSalary
      FROM employees
    `)
    .get();

  const byCountry = db
    .prepare(`
      SELECT
        country,
        COUNT(*) AS employees,
        ROUND(AVG(salary), 2) AS averageSalary
      FROM employees
      GROUP BY country
      ORDER BY country
    `)
    .all();

  return { overall, byCountry };
}

module.exports = {
  db,
  getEmployees,
  updateSalary,
  getSalarySummary,
};