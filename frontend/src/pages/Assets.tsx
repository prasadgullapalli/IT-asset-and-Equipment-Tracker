import React from "react";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";
import AssetForm from "../components/AssetForm";

const Assets = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");

  // Applied filters - only change when Apply button is clicked
  const [appliedTypeFilter, setAppliedTypeFilter] = useState("");
  const [appliedConditionFilter, setAppliedConditionFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  const [assignModal, setAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // 🔹 Fetch assets with filters
  const fetchAssets = async (type?: string, condition?: string, status?: string) => {
    const res = await api.get("/assets", {
      params: {
        type: type ?? appliedTypeFilter,
        condition: condition ?? appliedConditionFilter,
        status: status ?? appliedStatusFilter
      }
    });
    setAssets(res.data.data);
  };

  // 🔹 Fetch employees
  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data.data);
  };

  useEffect(() => {
    // Fetch employees on mount
    const loadEmployees = async () => {
      const res = await api.get("/employees");
      setEmployees(res.data.data);
    };
    
    loadEmployees();
    
    // Fetch initial assets without filters
    const loadAssets = async () => {
      const res = await api.get("/assets", {
        params: {
          type: "",
          condition: "",
          status: ""
        }
      });
      setAssets(res.data.data);
    };
    
    loadAssets();
  }, []);

  // 🔹 Delete asset
  const deleteAsset = async (id: number) => {
    await api.delete(`/assets/${id}`);
    fetchAssets();
  };

  // 🔹 Assign asset
  const assignAsset = async () => {
    if (!selectedEmployee) return;

    await api.post("/assignments", {
      asset_id: selectedAsset.id,
      employee_id: selectedEmployee
    });

    setAssignModal(false);
    fetchAssets();
  };

  // 🔹 Unassign asset
  const unassignAsset = async (assetId: number) => {
    try {
      // First get the current assignment for this asset
      const assignmentRes = await api.get(`/assignments/asset/${assetId}`);
      const assignment = assignmentRes.data.data;

      if (!assignment) {
        alert("No active assignment found for this asset");
        return;
      }

      // Then return the asset using the assignment ID
      await api.patch(`/assignments/${assignment.id}/return`);
      fetchAssets();
    } catch (error) {
      console.error("Error unassigning asset:", error);
      alert("Failed to unassign asset");
    }
  };

  // 🔹 Search filter - only use applied filters
  const filteredAssets = assets.filter((a) => {
    // Apply search filter
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    
    // Apply type filter (from applied filters, not current input)
    const matchesType = appliedTypeFilter === "" || a.type === appliedTypeFilter;
    
    // Apply condition filter (from applied filters, not current input)
    const matchesCondition = appliedConditionFilter === "" || a.condition === appliedConditionFilter;
    
    // Apply status/assignment filter (from applied filters, not current input)
    const matchesStatus = appliedStatusFilter === "" || a.status === appliedStatusFilter;
    
    return matchesSearch && matchesType && matchesCondition && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Asset Management</h1>
            <p className="text-gray-600 mt-1">Manage and track all your company assets</p>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 font-medium flex items-center gap-2"
          >
             Add Asset
          </button>
        </div>

        {/* FILTERS SECTION */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Assets</label>
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Conditions</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setAssignmentFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
              </select>
            </div>

            <button
              onClick={() => {
                // Update applied filters
                setAppliedTypeFilter(typeFilter);
                setAppliedConditionFilter(statusFilter);
                setAppliedStatusFilter(assignmentFilter);
                // Fetch with new filters
                fetchAssets(typeFilter, statusFilter, assignmentFilter);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
            >
              🔍 Apply
            </button>
          </div>
        </div>

      {/* ASSETS GRID/TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white"> Assets ({filteredAssets.length})</h2>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Asset Tag</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Assigned To</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Condition</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((a) => (
              <>
                {/* MAIN ROW */}
                <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">

                  <td className="px-6 py-4 font-medium text-gray-800">{a.name}</td>
                  <td className="px-6 py-4 text-gray-600">{a.assetTag}</td>

                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {a.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {a.assignedTo || <span className="text-green-600 font-medium">Available</span>}
                  </td>

                  {/* CONDITION */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-medium
                      ${a.condition === "Good" && "bg-green-500"}
                      ${a.condition === "Needs Repair" && "bg-yellow-500"}
                      ${a.condition === "Retired" && "bg-red-500"}
                    `}>
                      {a.condition}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-medium
                      ${a.status === "Available" && "bg-blue-500"}
                      ${a.status === "Assigned" && "bg-green-600"}
                      ${a.status === "Retired" && "bg-gray-500"}
                    `}>
                      {a.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => {
                          setEditData(a);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-white text-xs rounded transition duration-200"
                        title="Edit asset"
                      >
                         Edit
                      </button>

                      <button
                        onClick={() => deleteAsset(a.id)}
                        className="bg-red-500 hover:bg-red-600 px-2 py-1 text-white text-xs rounded transition duration-200"
                        title="Delete asset"
                      >
                         Delete
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAsset(a);
                          setAssignModal(true);
                        }}
                        className="bg-indigo-500 hover:bg-indigo-600 px-2 py-1 text-white text-xs rounded transition duration-200"
                        title="Assign asset"
                      >
                         Assign
                      </button>

                      {a.status === "Assigned" && (
                        <button
                          onClick={() => unassignAsset(a.id)}
                          className="bg-orange-500 hover:bg-orange-600 px-2 py-1 text-white text-xs rounded transition duration-200"
                          title="Return asset"
                        >
                           Return
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === a.id ? null : a.id)
                        }
                        className="bg-gray-600 hover:bg-gray-700 px-2 py-1 text-white text-xs rounded transition duration-200"
                      >
                        {expandedRow === a.id ? "▲ Less" : "▼ More"}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* EXPANDED ROW */}
                {expandedRow === a.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 px-6 py-4 text-left border-t-2 border-gray-200">

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                        <div>
                          <p className="font-semibold">Asset ID</p>
                          <p>{a.id}</p>
                        </div>

                        <div>
                          <p className="font-semibold">Serial Number</p>
                          <p>{a.serialNumber || "-"}</p>
                        </div>

                        <div>
                          <p className="font-semibold">Brand</p>
                          <p>{a.brand || "-"}</p>
                        </div>

                        <div>
                          <p className="font-semibold">Model</p>
                          <p>{a.model || "-"}</p>
                        </div>

                        <div>
                          <p className="font-semibold">Purchase Date</p>
                          <p>
                            {a.purchaseDate
                              ? new Date(a.purchaseDate).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold">Warranty Date</p>
                          <p>
                            {a.warrantyDate
                              ? new Date(a.warrantyDate).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold">Price</p>
                          <p>₹ {a.price || "-"}</p>
                        </div>

                        <div>
                          <p className="font-semibold">Type</p>
                          <p>{a.type}</p>
                        </div>

                        <div>
                          <p className="font-semibold">Status</p>
                          <p>{a.status}</p>
                        </div>

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

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <AssetForm
          onClose={() => setShowModal(false)}
          refresh={fetchAssets}
          editData={editData}
        />
      )}

      {/* ASSIGN MODAL */}
      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-[400px]">

            <h2 className="text-xl font-bold mb-4">Assign Asset</h2>

            <select
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>

              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setAssignModal(false)}
                className="bg-gray-400 px-3 py-2 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={assignAsset}
                className="bg-blue-600 px-3 py-2 text-white rounded"
              >
                Assign
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
    </Layout>
  );
};

export default Assets;