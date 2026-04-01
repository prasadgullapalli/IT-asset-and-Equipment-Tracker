import express from "express";
import { connectDB, sequelize } from "./config/db";
import "./models/User";
import "./models/Employee";
import "./models/Asset";
import "./models/MaintenanceLog";
import "./models/AssetAssignment";// ✅ important to load model
import authRoutes from "./routes/authRoutes";
import { protect } from "./middleware/authMiddleware";
import userRoutes from "./routes/userRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import assetRoutes from "./routes/assetRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assets", assetRoutes);

app.use("/api/assignments", assignmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use(errorHandler);
app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Protected route working" });
});

const startServer = async () => {
  try {
    await connectDB(); // ✅ from db.ts
    
    await sequelize.sync();
    console.log("✅ Tables synced");
    
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();
import bcrypt from "bcryptjs";
import User from "./models/User";

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "superadmin"
  });

  console.log("✅ Admin created");
};
