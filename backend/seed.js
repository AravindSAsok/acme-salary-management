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

const countries = [
  "India",
  "USA",
  "UK",
  "Germany",
  "Canada",
  "Australia",
];

const departments = [
  "Engineering",
  "HR",
  "Finance",
  "Sales",
  "Marketing",
];

const employeeCount = 10000;

const insert = db.prepare(`
  INSERT INTO employees
  (id, name, email, country, department, salary)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const seed = db.transaction(() => {
  const existing = db
    .prepare("SELECT COUNT(*) AS count FROM employees")
    .get().count;

  if (existing > 0) {
    console.log(
      `Database already contains ${existing} employees. Skipping seed.`
    );
    return;
  }

  for (let i = 1; i <= employeeCount; i++) {
    const country = countries[(i - 1) % countries.length];
    const department = departments[(i - 1) % departments.length];

    // Generates salaries between $30,000 and $149,999.
    const salary = 30000 + ((i * 137) % 120000);

    insert.run(
      i,
      `Employee ${i}`,
      `employee${i}@acme.com`,
      country,
      department,
      salary
    );
  }

  console.log(`Seeded ${employeeCount} employees.`);
});

try {
  seed();
} finally {
  db.close();
}