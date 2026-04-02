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
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Employees</h1>
            <p className="text-gray-600 mt-1">Manage and assign assets to employees</p>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 font-medium"
          >
             Add Employee
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm mt-2">Found: {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-lg font-bold text-white"> Employees ({filteredEmployees.length})</h2>
          </div>
          <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned Assets</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp: any) => (
              <>
                <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">

                  <td className="px-6 py-4 text-sm font-medium text-gray-800">#{emp.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      {emp.department || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.mobile}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                      {getAssignedAssets(emp.id).length} 
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => {
                          setEditData(emp);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 text-xs rounded transition duration-200"
                        title="Edit employee"
                      >
                         Edit
                      </button>

                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded transition duration-200"
                        title="Delete employee"
                      >
                         Delete
                      </button>

                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === emp.id ? null : emp.id)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded transition duration-200"
                      >
                        {expandedRow === emp.id ? "▲ Hide" : "▼ Assets"}
                      </button>
                    </div>
                  </td>

                </tr>

                {/* EXPANDED ROW - ASSIGNED ASSETS */}
                {expandedRow === emp.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                      <div className="text-left">
                        <h3 className="font-bold text-lg mb-4 text-gray-800"> Assigned Assets ({getAssignedAssets(emp.id).length})</h3>
                        {getAssignedAssets(emp.id).length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No assets assigned to this employee.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getAssignedAssets(emp.id).map((asset: any) => (
                              <div key={asset.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
                                <h4 className="font-semibold text-gray-800">{asset.name}</h4>
                                <p className="text-xs text-gray-600 mt-2"> Tag: <span className="font-mono">{asset.assetTag}</span></p>
                                <p className="text-xs text-gray-600"> Type: {asset.type}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs text-white font-medium mt-3 ${
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
      </div>
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