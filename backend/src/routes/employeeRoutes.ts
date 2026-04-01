import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController";

import { protect } from "../middleware/authMiddleware";
import { employeeValidation } from "../validators/employeeValidator";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

router.post("/", protect, employeeValidation, validate, createEmployee);
router.get("/", protect, getEmployees);
router.get("/:id", protect, getEmployee);
router.put("/:id", protect, employeeValidation, validate, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

export default router;