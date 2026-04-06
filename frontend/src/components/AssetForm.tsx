import { useState, useEffect } from "react";
import api from "../services/api";

const AssetForm = ({ onClose, refresh, editData }: any) => {
  const [form, setForm] = useState({
    assetTag: "",
    serialNumber: "",
    name: "",
    type: "Hardware",
    brand: "",
    model: "",
    purchaseDate: "",
    warrantyDate: "",
    price: "",
    condition: "Good"
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (editData) {
        await api.put(`/assets/${editData.id}`, form);
      } else {
        await api.post("/assets", form);
      }

      refresh();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Error occurred";

      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-[500px]">

        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Asset" : "Add Asset"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="assetTag" placeholder="Asset Tag"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.assetTag} required />

          <input name="serialNumber" placeholder="Serial Number"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.serialNumber} />

          <input name="name" placeholder="Asset Name"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.name} required />

          <select name="type" className="w-full p-2 border rounded"
            onChange={handleChange} value={form.type}>
            <option>Hardware</option>
            <option>Software</option>
          </select>

          <input name="brand" placeholder="Brand"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.brand} />

          <input name="model" placeholder="Model"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.model} />
          
          <label className="block mb-1">Purchase Date</label>
          <input type="date" name="purchaseDate"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.purchaseDate} />
          
          <label className="block mb-1">Warranty Date</label>
          <input type="date" name="warrantyDate"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.warrantyDate} />

          <input name="price" placeholder="Price"
            className="w-full p-2 border rounded"
            onChange={handleChange} value={form.price} />

          <select name="condition" className="w-full p-2 border rounded"
            onChange={handleChange} value={form.condition}>
            <option>Good</option>
            <option>Needs Repair</option>
            <option>Retired</option>
          </select>

          <div className="flex justify-end space-x-2">

            <button type="button" onClick={onClose}
              className="bg-gray-400 text-white px-3 py-2 rounded">
              Cancel
            </button>

            <button type="submit"
              className="bg-blue-600 text-white px-3 py-2 rounded">
              {editData ? "Update" : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AssetForm;
