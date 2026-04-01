import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeForm from "../components/EmployeeForm";
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data.data);
  };

  const deleteEmployee = async (id: number) => {
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };
  const [showModal, setShowModal] = useState(false);
const [editData, setEditData] = useState(null);

  // Filter employees based on search term (by ID or name)
  const filteredEmployees = employees.filter((emp: any) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.id.toString().includes(term) ||
      emp.name.toLowerCase().includes(term)
    );
  });

  return (
    <Layout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>

        <button
  onClick={() => {
    setEditData(null);
    setShowModal(true);
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  + Add Employee
</button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded shadow">

        <table className="w-full border">

          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Designation</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp: any) => (
              <tr key={emp.id} className="border-t text-center">

                <td className="p-2">{emp.id}</td>
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.department}</td>
                <td className="p-2">{emp.mobile}</td>

                <td className="p-2 space-x-2">
                  <button
  onClick={() => {
    setEditData(emp);
    setShowModal(true);
  }}
  className="bg-yellow-500 text-white px-2 py-1 rounded"
>
  Edit
</button>

                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
{showModal && (
  <EmployeeForm
    onClose={() => setShowModal(false)}
    refresh={fetchEmployees}
    editData={editData}
  />
)}
    </Layout>
  );
};

export default Employees;