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

const countries = ["India", "USA", "UK", "Germany", "Canada", "Australia"];
const departments = ["Engineering", "HR", "Finance", "Sales", "Marketing"];

const existing = db
  .prepare("SELECT COUNT(*) AS count FROM employees")
  .get().count;

if (existing > 0) {
  console.log(`Database already contains ${existing} employees.`);
  db.close();
  process.exit(0);
}

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

console.log("Seeded 10,000 employees.");

db.close();