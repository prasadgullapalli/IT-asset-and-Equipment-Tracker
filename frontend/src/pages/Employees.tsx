import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeForm from "../components/EmployeeForm";
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchAssets();
  }, []);

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data.data);
  };

  const fetchAssets = async () => {
    const res = await api.get("/assets");
    setAssets(res.data.data);
  };

  const deleteEmployee = async (id: number) => {
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  // Get assets assigned to a specific employee
  const getAssignedAssets = (employeeId: number) => {
    return assets.filter((asset: any) => parseInt(asset.assignedTo) === employeeId);
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
              <th className="p-2">Assigned Assets</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp: any) => (
              <>
                <tr key={emp.id} className="border-t text-center">

                  <td className="p-2">{emp.id}</td>
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">{emp.mobile}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {getAssignedAssets(emp.id).length} assets
                    </span>
                  </td>

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

                    <button
                      onClick={() =>
                        setExpandedRow(expandedRow === emp.id ? null : emp.id)
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      {expandedRow === emp.id ? "Hide Assets" : "Show Assets"}
                    </button>
                  </td>

                </tr>

                {/* EXPANDED ROW - ASSIGNED ASSETS */}
                {expandedRow === emp.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 p-4">
                      <div className="text-left">
                        <h3 className="font-semibold mb-3">Assigned Assets ({getAssignedAssets(emp.id).length})</h3>
                        {getAssignedAssets(emp.id).length === 0 ? (
                          <p className="text-gray-500">No assets assigned to this employee.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getAssignedAssets(emp.id).map((asset: any) => (
                              <div key={asset.id} className="bg-white p-3 rounded border">
                                <h4 className="font-medium">{asset.name}</h4>
                                <p className="text-sm text-gray-600">Tag: {asset.assetTag}</p>
                                <p className="text-sm text-gray-600">Type: {asset.type}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 ${
                                  asset.condition === "Good" ? "bg-green-500" :
                                  asset.condition === "Needs Repair" ? "bg-yellow-500" : "bg-red-500"
                                }`}>
                                  {asset.condition}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
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