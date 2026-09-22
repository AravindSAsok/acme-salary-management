const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getEmployees,
  updateSalary,
  getSalarySummary,
} = require("../db");

test("database contains 10,000 employees", () => {
  const employees = getEmployees();

  assert.equal(employees.length, 10000);
});

test("employees contain required salary data", () => {
  const employees = getEmployees();

  assert.ok(employees[0].salary >= 0);
  assert.ok(employees[0].name);
  assert.ok(employees[0].email);
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