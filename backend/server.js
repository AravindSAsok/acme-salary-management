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

const count = db.prepare("SELECT COUNT(*) AS count FROM employees").get().count;

if (count === 0) {
  const countries = ["India", "USA", "UK", "Germany", "Canada", "Australia"];
  const departments = ["Engineering", "HR", "Finance", "Sales", "Marketing"];

  const insert = db.prepare(`
    INSERT INTO employees
    (name, email, country, department, salary)
    VALUES (?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    for (let i = 1; i <= 10000; i++) {
      const country = countries[(i - 1) % countries.length];
      const department = departments[(i - 1) % departments.length];
      const salary = 30000 + ((i * 137) % 120000);

      insert.run(
        `Employee ${i}`,
        `employee${i}@acme.com`,
        country,
        department,
        salary
      );
    }
  });

  seed();
  console.log("Seeded 10,000 employees");
}

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
