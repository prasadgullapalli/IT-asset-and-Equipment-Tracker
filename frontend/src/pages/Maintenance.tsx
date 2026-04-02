import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

interface MaintenanceLog {
  id: number;
  asset_id: number;
  description: string;
  cost: number;
  technician: string;
  date: string;
  createdAt: string;
}

interface Asset {
  id: number;
  name: string;
  assetTag: string;
}

const Maintenance = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    asset_id: "",
    description: "",
    cost: "",
    technician: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (selectedAsset) {
      fetchLogs(selectedAsset);
    }
  }, [selectedAsset]);

  const fetchAssets = async () => {
    try {
      const res = await api.get("/assets");
      setAssets(res.data.data);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    }
  };

  const fetchLogs = async (assetId: number) => {
    try {
      const res = await api.get(`/maintenance/${assetId}`);
      setLogs(res.data.data);
    } catch (error) {
      console.error("Failed to fetch maintenance logs:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/maintenance", {
        ...formData,
        asset_id: parseInt(formData.asset_id),
        cost: parseFloat(formData.cost)
      });
      setShowModal(false);
      setFormData({
        asset_id: "",
        description: "",
        cost: "",
        technician: "",
        date: new Date().toISOString().split('T')[0]
      });
      if (selectedAsset) {
        fetchLogs(selectedAsset);
      }
    } catch (error) {
      console.error("Failed to add maintenance log:", error);
    }
  };

  // Calculate statistics
  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
  const totalMaintenances = logs.length;

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Maintenance Logs</h1>
            <p className="text-gray-600 mt-1">Track and manage asset maintenance records</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 font-medium"
          >
             Add Maintenance Log
          </button>
        </div>

        {/* Asset Selector and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Asset Selector */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Asset</label>
            <select
              value={selectedAsset || ""}
              onChange={(e) => setSelectedAsset(parseInt(e.target.value) || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value=""> Select an asset...</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.assetTag})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Maintenance Stats</p>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-800">{totalMaintenances}</p>
              <p className="text-xs text-gray-600 mt-1">Total Maintenance Records</p>
              <p className="text-lg font-semibold text-blue-600 mt-2">₹{totalCost.toFixed(2)}</p>
              <p className="text-xs text-gray-600">Total Cost</p>
            </div>
          </div>
        </div>

        {/* Maintenance Logs */}
        {selectedAsset ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white">🔧 Maintenance History ({logs.length})</h2>
            </div>
            <div className="p-6">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg"> No maintenance logs found for this asset.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-200 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase">Date</p>
                          <p className="text-lg font-bold text-gray-800 mt-1">{new Date(log.date).toLocaleDateString()}</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase"> Technician</p>
                          <p className="text-lg font-bold text-gray-800 mt-1">{log.technician}</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase"> Cost</p>
                          <p className="text-lg font-bold text-purple-600 mt-1">₹{log.cost.toFixed(2)}</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase"> Description</p>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2">{log.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">👆 Please select an asset to view maintenance history</p>
          </div>
        )}

      {/* Add Maintenance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Add Maintenance Log</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Asset</label>
                <select
                  value={formData.asset_id}
                  onChange={(e) => setFormData({...formData, asset_id: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Asset</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.assetTag})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Technician</label>
                <input
                  type="text"
                  value={formData.technician}
                  onChange={(e) => setFormData({...formData, technician: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Technician name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Maintenance description"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </Layout>
  );
};

export default Maintenance;