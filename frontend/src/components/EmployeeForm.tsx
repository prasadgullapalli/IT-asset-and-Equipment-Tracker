import { useState, useEffect } from "react";
import api from "../services/api";

const EmployeeForm = ({ onClose, refresh, editData }: any) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    mobile: ""
  });

  // ✅ Prefill when editing
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");

const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    if (editData) {
      await api.put(`/employees/${editData.id}`, form);
    } else {
      await api.post("/employees", form);
    }

    refresh();
    onClose();
  } catch (err: any) {
    const msg =
      err.response?.data?.errors?.[0]?.msg ||
      err.response?.data?.message ||
      "Something went wrong";

    setError(msg);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-[400px]">

        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Employee" : "Add Employee"}
        </h2>
        {error && (
  <p className="text-red-500 text-sm mb-2">{error}</p>
)}

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Designation"
            value={form.department}
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />

          <div className="flex justify-end space-x-2">

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              {editData ? "Update" : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;