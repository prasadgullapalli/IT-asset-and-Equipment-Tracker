import { body } from "express-validator";

export const assetValidation = [
  body("assetTag").notEmpty().withMessage("Asset tag required"),

  body("name").notEmpty().withMessage("Asset name required"),

  body("type")
    .isIn(["Hardware", "Software"])
    .withMessage("Type must be Hardware or Software"),

  body("condition")
    .optional()
    .isIn(["Good", "Needs Repair", "Retired"])
];