import { Router } from "express";
import { addLog, getLogs } from "../controllers/maintenanceController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Add maintenance log
router.post("/", protect, addLog);

// Get logs by asset
router.get("/:assetId", protect, getLogs);

export default router;