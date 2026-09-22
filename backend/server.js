const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("acme.db");

app.use(cors());
app.use(express.json());

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

app.get("/api/employees", (req, res) => {
  const employees = db
    .prepare("SELECT * FROM employees ORDER BY id")
    .all();

  res.json(employees);
});

app.put("/api/employees/:id/salary", (req, res) => {
  const salary = Number(req.body.salary);

  if (!Number.isFinite(salary) || salary < 0) {
    return res.status(400).json({ error: "Invalid salary" });
  }

  const result = db
    .prepare("UPDATE employees SET salary = ? WHERE id = ?")
    .run(salary, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json({ message: "Salary updated" });
});

app.get("/api/salary-summary", (req, res) => {
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

  res.json({ overall, byCountry });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});