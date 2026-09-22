const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getEmployees,
  updateSalary,
  getSalarySummary,
} = require("../db");

test("database contains 10,000 employees", () => {
  const result = getEmployees({ page: 1, limit: 25 });

  assert.equal(result.pagination.total, 10000);
  assert.equal(result.employees.length, 25);
});

test("employee records contain required data", () => {
  const result = getEmployees({ page: 1, limit: 1 });
  const employee = result.employees[0];

  assert.ok(employee);
  assert.ok(employee.salary >= 0);
  assert.ok(employee.name);
  assert.ok(employee.email);
  assert.ok(employee.country);
  assert.ok(employee.department);
});

test("employee pagination returns the requested page size", () => {
  const result = getEmployees({
    page: 2,
    limit: 25,
  });

  assert.equal(result.employees.length, 25);
  assert.equal(result.pagination.page, 2);
  assert.equal(result.pagination.limit, 25);
  assert.equal(result.pagination.totalPages, 400);
});

test("employee search filters results", () => {
  const result = getEmployees({
    search: "Employee 1",
    page: 1,
    limit: 25,
  });

  assert.ok(result.pagination.total > 0);
  assert.ok(
    result.employees.every((employee) =>
      employee.name.toLowerCase().includes("employee 1")
    )
  );
});

test("salary summary returns correct employee count", () => {
  const summary = getSalarySummary();

  assert.equal(summary.overall.employees, 10000);
  assert.ok(summary.overall.averageSalary > 0);
  assert.ok(summary.overall.minimumSalary > 0);
  assert.ok(summary.overall.maximumSalary > 0);
});

test("salary summary contains all countries", () => {
  const summary = getSalarySummary();

  assert.equal(summary.byCountry.length, 6);

  const countries = summary.byCountry.map((item) => item.country);

  assert.deepEqual(countries, [
    "Australia",
    "Canada",
    "Germany",
    "India",
    "UK",
    "USA",
  ]);
});

test("salary update rejects negative salary", () => {
  const result = updateSalary(1, -100);

  assert.equal(result.error, "Invalid salary");
});

test("salary update rejects invalid salary", () => {
  const result = updateSalary(1, "not-a-number");

  assert.equal(result.error, "Invalid salary");
});

test("salary update returns not found for unknown employee", () => {
  const result = updateSalary(999999, 50000);

  assert.equal(result.error, "Employee not found");
});