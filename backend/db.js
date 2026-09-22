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

function getEmployees() {
  return db
    .prepare("SELECT * FROM employees ORDER BY id")
    .all();
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