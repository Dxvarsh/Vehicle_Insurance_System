import { body } from 'express-validator';

export const submitClaimValidator = [
  body('policyID')
    .notEmpty()
    .withMessage('Policy ID is required')
    .isMongoId()
    .withMessage('Invalid Policy ID format'),
  body('vehicleID')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isMongoId()
    .withMessage('Invalid Vehicle ID format'),
  body('premiumID')
    .notEmpty()
    .withMessage('Premium ID is required')
    .isMongoId()
    .withMessage('Invalid Premium ID format'),
  body('claimReason')
    .notEmpty()
    .withMessage('Claim reason is required')
    .isLength({ min: 10 })
    .withMessage('Claim reason must be at least 10 characters long')
    .isLength({ max: 1000 })
    .withMessage('Claim reason cannot exceed 1000 characters'),
  body('supportingDocuments')
    .optional()
    .isArray()
    .withMessage('Supporting documents must be an array of strings (URLs)'),
];

export const processClaimValidator = [
  body('claimStatus')
    .notEmpty()
    .withMessage('Claim status is required')
    .isIn(['Approved', 'Rejected', 'Under-Review'])
    .withMessage('Invalid claim status'),
  body('claimAmount')
    .if(body('claimStatus').equals('Approved'))
    .notEmpty()
    .withMessage('Claim amount is required for approved claims')
    .isFloat({ min: 0 })
    .withMessage('Claim amount must be a positive number'),
  body('adminRemarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin remarks cannot exceed 500 characters'),
];
