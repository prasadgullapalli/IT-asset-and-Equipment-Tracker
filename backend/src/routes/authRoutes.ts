import { Router } from "express";
import { login, getMe } from "../controllers/authController";
import { forgotPassword, resetPassword } from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;