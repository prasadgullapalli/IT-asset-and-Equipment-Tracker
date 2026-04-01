import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";   // ✅ added
import Assets from "../pages/Assets";         // ✅ added
import AdminManagement from "../pages/AdminManagement"; // ✅ added
import Maintenance from "../pages/Maintenance"; // ✅ added
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Employees />
            </PrivateRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <PrivateRoute>
              <Assets />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-management"
          element={
            <PrivateRoute>
              <AdminManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <PrivateRoute>
              <Maintenance />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
