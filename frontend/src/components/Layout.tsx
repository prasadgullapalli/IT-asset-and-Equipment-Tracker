import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-600 text-white p-5">
        <h2 className="text-xl font-bold mb-6">IT Tracker</h2>

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