import { body } from "express-validator";

export const employeeValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("mobile")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile must be 10 digits")
];