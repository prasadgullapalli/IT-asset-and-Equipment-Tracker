import { Router } from "express";
import {
  getUsers,
  createUser,
  toggleUser,
  deleteUser
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// SuperAdmin only routes
router.get("/", protect, authorize(["superadmin"]), getUsers);
router.post("/", protect, authorize(["superadmin"]), createUser);
router.patch("/:id/toggle", protect, authorize(["superadmin"]), toggleUser);
router.delete("/:id", protect, authorize(["superadmin"]), deleteUser);

export default router;