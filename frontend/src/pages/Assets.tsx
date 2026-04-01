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

  const [assignModal, setAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  // 🔹 Fetch assets
  const fetchAssets = async () => {
    const res = await api.get("/assets", {
      params: {
        type: typeFilter,
        condition: statusFilter,
        status: assignmentFilter
      }
    });
    setAssets(res.data.data);
  };

  // 🔹 Fetch employees
  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data.data);
  };

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

  // 🔹 Search filter
  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Asset Management</h1>

        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Asset
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-4 flex-wrap">

        <input
          type="text"
          placeholder="Search assets..."
          className="p-2 border rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Condition</option>
          <option value="Good">Good</option>
          <option value="Needs Repair">Needs Repair</option>
          <option value="Retired">Retired</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setAssignmentFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Retired">Retired</option>
        </select>

        <button
          onClick={fetchAssets}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">

        <table className="w-full border text-sm">

          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th>Asset Tag</th>
              <th>Type</th>
              <th>Assigned To</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((a) => (
              <>
                {/* MAIN ROW */}
                <tr key={a.id} className="text-center border-t">

                  <td className="p-2 font-medium">{a.name}</td>
                  <td>{a.assetTag}</td>

                  <td>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {a.type}
                    </span>
                  </td>

                  <td>
                    {a.assignedTo || "Available"}
                  </td>

                  {/* CONDITION */}
                  <td>
                    <span className={`px-2 py-1 rounded text-white text-xs
                      ${a.condition === "Good" && "bg-green-500"}
                      ${a.condition === "Needs Repair" && "bg-yellow-500"}
                      ${a.condition === "Retired" && "bg-red-500"}
                    `}>
                      {a.condition}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`px-2 py-1 rounded text-white text-xs
                      ${a.status === "Available" && "bg-blue-500"}
                      ${a.status === "Assigned" && "bg-green-600"}
                      ${a.status === "Retired" && "bg-gray-500"}
                    `}>
                      {a.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="space-x-2">

                    <button
                      onClick={() => {
                        setEditData(a);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 px-2 py-1 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAsset(a.id)}
                      className="bg-red-500 px-2 py-1 text-white rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAsset(a);
                        setAssignModal(true);
                      }}
                      className="bg-indigo-500 px-2 py-1 text-white rounded"
                    >
                      Assign
                    </button>

                    {a.status === "Assigned" && (
                      <button
                        onClick={() => unassignAsset(a.id)}
                        className="bg-orange-500 px-2 py-1 text-white rounded"
                      >
                        Unassign
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setExpandedRow(expandedRow === a.id ? null : a.id)
                      }
                      className="bg-gray-600 px-2 py-1 text-white rounded"
                    >
                      {expandedRow === a.id ? "Hide" : "Show More"}
                    </button>

                  </td>
                </tr>

                {/* EXPANDED ROW */}
                {expandedRow === a.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 p-4 text-left">

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

    </Layout>
  );
};

export default Assets;