import { body } from "express-validator";

export const submitRenewalValidator = [
  body("policyID")
    .notEmpty()
    .withMessage("Policy ID is required")
    .isMongoId()
    .withMessage("Invalid Policy ID format"),
  body("vehicleID")
    .notEmpty()
    .withMessage("Vehicle ID is required")
    .isMongoId()
    .withMessage("Invalid Vehicle ID format"),
];

export const processRenewalValidator = [
  body("adminRemarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Admin remarks cannot exceed 500 characters"),
];
