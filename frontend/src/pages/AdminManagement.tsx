import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "superadmin") {
      fetchAdmins();
    }
  }, [user]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/users");
      setAdmins(res.data.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editData) {
        await api.put(`/users/${editData.id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      setShowModal(false);
      setEditData(null);
      setFormData({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (error) {
      console.error("Failed to save admin:", error);
    }
  };

  const toggleAdminStatus = async (adminId: number) => {
    try {
      await api.patch(`/users/${adminId}/toggle`);
      fetchAdmins();
    } catch (error) {
      console.error("Failed to toggle admin status:", error);
    }
  };

  const deleteAdmin = async (adminId: number) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await api.delete(`/users/${adminId}`);
        fetchAdmins();
      } catch (error) {
        console.error("Failed to delete admin:", error);
      }
    }
  };

  const openEditModal = (admin: Admin) => {
    setEditData(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role
    });
    setShowModal(true);
  };

  if (user?.role !== "superadmin") {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <button
          onClick={() => {
            setEditData(null);
            setFormData({ name: "", email: "", password: "", role: "admin" });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Admin
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3 capitalize">{admin.role}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-white text-xs ${
                    admin.isActive ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => openEditModal(admin)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAdminStatus(admin.id)}
                    className={`text-white px-2 py-1 rounded text-sm ${
                      admin.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {admin.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editData ? "Edit Admin" : "Add Admin"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {!editData && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border rounded"
                    required={!editData}
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">SuperAdmin</option>
                </select>
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
                  {editData ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminManagement;