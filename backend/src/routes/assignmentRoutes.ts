import { Router } from "express";
import { assignAsset, returnAsset } from "../controllers/assignmentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Assign asset
router.post("/", protect, assignAsset);

// Return asset
router.patch("/:id/return", protect, returnAsset);

export default router;