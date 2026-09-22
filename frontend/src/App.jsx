import { useEffect, useState } from "react";

const API = "http://localhost:3001/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [salary, setSalary] = useState("");
  const [error, setError] = useState("");

  const limit = 25;

  const loadData = async () => {
    setError("");

    try {
      const employeeParams = new URLSearchParams({
        search,
        page,
        limit,
      });

      const [employeesRes, summaryRes] = await Promise.all([
        fetch(`${API}/employees?${employeeParams}`),
        fetch(`${API}/salary-summary`),
      ]);

      if (!employeesRes.ok || !summaryRes.ok) {
        throw new Error("Failed to load data");
      }

      const employeeData = await employeesRes.json();
      const summaryData = await summaryRes.json();

      setEmployees(employeeData.employees);
      setPagination(employeeData.pagination);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, page]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const updateSalary = async (id) => {
    setError("");

    const response = await fetch(`${API}/employees/${id}/salary`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salary: Number(salary),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Failed to update salary");
      return;
    }

    setEditingId(null);
    setSalary("");

    await loadData();
  };

  return (
    <main>
      <h1>ACME Salary Management</h1>
      <p className="subtitle">HR Manager Dashboard</p>

      {error && <p className="error">{error}</p>}

      {summary && (
        <>
          <section className="cards">
            <div>
              <span>Employees</span>
              <strong>{summary.overall.employees}</strong>
            </div>

            <div>
              <span>Average Salary</span>
              <strong>
                ${summary.overall.averageSalary.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Minimum Salary</span>
              <strong>
                ${summary.overall.minimumSalary.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Maximum Salary</span>
              <strong>
                ${summary.overall.maximumSalary.toLocaleString()}
              </strong>
            </div>
          </section>

          <section>
            <h2>Salary by Country</h2>

            <table>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Employees</th>
                  <th>Average Salary</th>
                </tr>
              </thead>

              <tbody>
                {summary.byCountry.map((country) => (
                  <tr key={country.country}>
                    <td>{country.country}</td>
                    <td>{country.employees}</td>
                    <td>
                      ${country.averageSalary.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      <section>
        <div className="employee-header">
          <div>
            <h2>Employees</h2>

            {pagination && (
              <p className="result-count">
                Showing {employees.length} of {pagination.total} employees
              </p>
            )}
          </div>

          <input
            type="search"
            placeholder="Search name, email, country..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.country}</td>
                <td>{employee.department}</td>

                <td>
                  {editingId === employee.id ? (
                    <input
                      type="number"
                      min="0"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  ) : (
                    `$${employee.salary.toLocaleString()}`
                  )}
                </td>

                <td>
                  {editingId === employee.id ? (
                    <button
                      onClick={() => updateSalary(employee.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(employee.id);
                        setSalary(employee.salary);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="7">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;