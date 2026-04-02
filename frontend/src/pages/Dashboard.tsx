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

  // Calculate statistics
  const assignedAssets = assets.filter((a) => a.status === "Assigned").length;
  const availableAssets = assets.filter((a) => a.status === "Available").length;
  const needsRepair = assets.filter((a) => a.condition === "Needs Repair").length;

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your asset overview</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg transition duration-200 font-medium"
          >
            Logout
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Assets */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Assets</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{assets.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8-4m-8 4v10l8-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Assigned Assets */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assigned Assets</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{assignedAssets}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Available Assets */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Assets</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{availableAssets}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Needs Repair */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Needs Repair</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{needsRepair}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ASSETS TABLE */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-lg font-bold text-white"> Recent Assets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Condition</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.length > 0 ? (
                  assets.slice(0, 10).map((a) => (
                    <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{a.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {a.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          a.condition === "Good" ? "bg-green-500" :
                          a.condition === "Needs Repair" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}>
                          {a.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          a.status === "Available" ? "bg-green-500" :
                          a.status === "Assigned" ? "bg-blue-500" :
                          "bg-gray-500"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                       No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;