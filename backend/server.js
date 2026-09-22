const express = require("express");
const cors = require("cors");
const path = require("node:path");
const fs = require("node:fs");

const {
  getEmployees,
  updateSalary,
  getSalarySummary,
} = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/employees", (req, res) => {
  const { search = "", page = 1, limit = 25 } = req.query;

  const result = getEmployees({
    search,
    page,
    limit,
  });

  res.json(result);
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

const frontendDist = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/api") &&
      fs.existsSync(path.join(frontendDist, "index.html"))
    ) {
      return res.sendFile(path.join(frontendDist, "index.html"));
    }

    next();
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});