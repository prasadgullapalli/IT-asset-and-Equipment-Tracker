import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get("/assets");
      setAssets(res.data.data || []);
    } catch (err) {
      console.error("Error fetching assets:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Layout>
      <div className="p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <h2>Total Assets</h2>
            <p className="text-xl">{assets.length}</p>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Assets List</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Condition</th>
              </tr>
            </thead>

            <tbody>
              {assets.length > 0 ? (
                assets.map((a) => (
                  <tr key={a.id} className="text-center border-t">
                    <td className="p-2">{a.name}</td>
                    <td className="p-2">{a.type}</td>
                    <td className="p-2">{a.condition}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;