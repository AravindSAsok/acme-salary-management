import { useEffect, useState } from "react";

const API = "http://localhost:3001/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [salary, setSalary] = useState("");

  const loadData = async () => {
    const [employeesRes, summaryRes] = await Promise.all([
      fetch(`${API}/employees`),
      fetch(`${API}/salary-summary`),
    ]);

    setEmployees(await employeesRes.json());
    setSummary(await summaryRes.json());
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSalary = async (id) => {
    await fetch(`${API}/employees/${id}/salary`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary: Number(salary) }),
    });

    setEditingId(null);
    setSalary("");
    loadData();
  };

  return (
    <main>
      <h1>ACME Salary Management</h1>
      <p className="subtitle">HR Manager Dashboard</p>

      {summary && (
        <>
          <section className="cards">
            <div>
              <span>Employees</span>
              <strong>{summary.overall.employees}</strong>
            </div>

            <div>
              <span>Average Salary</span>
              <strong>${summary.overall.averageSalary.toLocaleString()}</strong>
            </div>

            <div>
              <span>Minimum Salary</span>
              <strong>${summary.overall.minimumSalary.toLocaleString()}</strong>
            </div>

            <div>
              <span>Maximum Salary</span>
              <strong>${summary.overall.maximumSalary.toLocaleString()}</strong>
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
                    <td>${country.averageSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      <section>
        <h2>Employees</h2>

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
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  ) : (
                    `$${employee.salary.toLocaleString()}`
                  )}
                </td>
                <td>
                  {editingId === employee.id ? (
                    <button onClick={() => updateSalary(employee.id)}>
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
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;