const express = require("express");
const cors = require("cors");
const {
  getEmployees,
  updateSalary,
  getSalarySummary,
} = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/employees", (req, res) => {
  const employees = getEmployees();

  res.json(employees);
});

app.put("/api/employees/:id/salary", (req, res) => {
  const salary = Number(req.body.salary);
  const result = updateSalary(req.params.id, salary);

  if (result.error === "Invalid salary") {
    return res.status(400).json(result);
  }

  if (result.error === "Employee not found") {
    return res.status(404).json(result);
  }

  res.json(result);
});

app.get("/api/salary-summary", (req, res) => {
  const summary = getSalarySummary();

  res.json(summary);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});