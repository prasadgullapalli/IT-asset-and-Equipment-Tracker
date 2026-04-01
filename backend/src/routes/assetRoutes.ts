import { Router } from "express";
import {
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset,
  updateCondition
} from "../controllers/assetController";

import { protect } from "../middleware/authMiddleware";
import { assetValidation } from "../validators/assetValidator";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

router.post("/", protect, assetValidation, validate, createAsset);
router.get("/", protect, getAssets);
router.get("/:id", protect, getAsset);
router.put("/:id", protect, assetValidation, validate, updateAsset);
router.patch("/:id/condition", protect, updateCondition);
router.delete("/:id", protect, deleteAsset);

export default router;