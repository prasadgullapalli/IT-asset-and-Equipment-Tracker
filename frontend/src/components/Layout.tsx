import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-600 text-white p-5">
        <h2 className="text-xl font-bold mb-6">IT Tracker</h2>

        {/* User Info */}
        {user && (
          <div className="mb-6 p-3 bg-blue-700 rounded">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs opacity-80 capitalize">{user.role}</p>
          </div>
        )}

        <ul className="space-y-4">
          <li
            className="cursor-pointer hover:bg-blue-700 p-2 rounded"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </li>

          <li
            className="cursor-pointer hover:bg-blue-700 p-2 rounded"
            onClick={() => navigate("/employees")}
          >
            Employees
          </li>

          <li
            className="cursor-pointer hover:bg-blue-700 p-2 rounded"
            onClick={() => navigate("/assets")}
          >
            Assets
          </li>

          <li
            className="cursor-pointer hover:bg-blue-700 p-2 rounded"
            onClick={() => navigate("/maintenance")}
          >
            Maintenance
          </li>

          {/* SuperAdmin Only */}
          {user?.role === "superadmin" && (
            <li
              className="cursor-pointer hover:bg-blue-700 p-2 rounded bg-blue-800"
              onClick={() => navigate("/admin-management")}
            >
              Manage Admins
            </li>
          )}
        </ul>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 px-4 py-2 rounded w-full"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;