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
        <h2 className="text-xl font-bold mb-6">IT Asset & Equipment Tracker</h2>

        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg shadow-md border-l-4 border-white hover:shadow-lg transition duration-200">
            <p className="text-sm font-bold text-white">👤 {user.name}</p>
            <p className="text-xs opacity-90 capitalize mt-1 font-semibold text-blue-100">    {user.role}</p>
          </div>
        )}

        <ul className="space-y-2">
          <li
            className="cursor-pointer hover:bg-blue-500 hover:shadow-lg hover:scale-105 p-3 rounded-lg transition duration-200 ease-in-out transform border-l-4 border-transparent hover:border-white hover:pl-4"
            onClick={() => navigate("/dashboard")}
          >
             Dashboard
          </li>

          <li
            className="cursor-pointer hover:bg-blue-500 hover:shadow-lg hover:scale-105 p-3 rounded-lg transition duration-200 ease-in-out transform border-l-4 border-transparent hover:border-white hover:pl-4"
            onClick={() => navigate("/employees")}
          >
             Employees
          </li>

          <li
            className="cursor-pointer hover:bg-blue-500 hover:shadow-lg hover:scale-105 p-3 rounded-lg transition duration-200 ease-in-out transform border-l-4 border-transparent hover:border-white hover:pl-4"
            onClick={() => navigate("/assets")}
          >
             Assets
          </li>

          <li
            className="cursor-pointer hover:bg-blue-500 hover:shadow-lg hover:scale-105 p-3 rounded-lg transition duration-200 ease-in-out transform border-l-4 border-transparent hover:border-white hover:pl-4"
            onClick={() => navigate("/maintenance")}
          >
             Maintenance
          </li>

          {/* SuperAdmin Only */}
          {user?.role === "superadmin" && (
            <li
              className="cursor-pointer hover:bg-blue-400 hover:shadow-lg hover:scale-105 p-3 rounded-lg bg-blue-800 transition duration-200 ease-in-out transform border-l-4 border-yellow-400 hover:border-yellow-300 hover:pl-4"
              onClick={() => navigate("/admin-management")}
            >
               Manage Admins
            </li>
          )}
        </ul>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 hover:bg-red-600 hover:shadow-lg transition duration-200 px-4 py-3 rounded-lg w-full font-medium transform hover:scale-105"
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