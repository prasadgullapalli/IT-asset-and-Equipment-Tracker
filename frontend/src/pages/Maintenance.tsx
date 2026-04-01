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

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Logs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Maintenance Log
        </button>
      </div>

      {/* Asset Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Asset</label>
        <select
          value={selectedAsset || ""}
          onChange={(e) => setSelectedAsset(parseInt(e.target.value) || null)}
          className="p-2 border rounded w-64"
        >
          <option value="">Select an asset...</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name} ({asset.assetTag})
            </option>
          ))}
        </select>
      </div>

      {/* Maintenance Logs */}
      {selectedAsset && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500">No maintenance logs found for this asset.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date</p>
                      <p>{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Technician</p>
                      <p>{log.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cost</p>
                      <p>₹{log.cost}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Description</p>
                      <p className="text-sm">{log.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </Layout>
  );
};

export default Maintenance;