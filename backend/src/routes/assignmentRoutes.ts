import { Router } from "express";
import { assignAsset, returnAsset, getAssignmentByAssetId } from "../controllers/assignmentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Assign asset
router.post("/", protect, assignAsset);

// Return asset
router.patch("/:id/return", protect, returnAsset);

// Get assignment by asset ID
router.get("/asset/:assetId", protect, getAssignmentByAssetId);

export default router;