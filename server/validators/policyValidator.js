import { body, param, query } from 'express-validator';

// ─────────────────────────────────────────────
// Create Policy (Admin)
// ─────────────────────────────────────────────
export const createPolicyValidator = [
  body('policyName')
    .trim()
    .notEmpty()
    .withMessage('Policy name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Policy name must be between 3 and 100 characters'),

  body('coverageType')
    .trim()
    .notEmpty()
    .withMessage('Coverage type is required')
    .isIn(['Third-Party', 'Comprehensive', 'Own-Damage'])
    .withMessage('Coverage type must be Third-Party, Comprehensive, or Own-Damage'),

  body('policyDuration')
    .notEmpty()
    .withMessage('Policy duration is required')
    .isIn([12, 24, 36])
    .withMessage('Policy duration must be 12, 24, or 36 months'),

  body('baseAmount')
    .notEmpty()
    .withMessage('Base amount is required')
    .isFloat({ min: 0 })
    .withMessage('Base amount must be a positive number'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  // Premium Rules (optional - uses defaults if not provided)
  body('premiumRules')
    .optional()
    .isObject()
    .withMessage('Premium rules must be an object'),

  body('premiumRules.vehicleTypeMultiplier')
    .optional()
    .isObject()
    .withMessage('Vehicle type multiplier must be an object'),

  body('premiumRules.vehicleTypeMultiplier.2-Wheeler')
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage('2-Wheeler multiplier must be between 0.1 and 5'),

  body('premiumRules.vehicleTypeMultiplier.4-Wheeler')
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage('4-Wheeler multiplier must be between 0.1 and 5'),

  body('premiumRules.vehicleTypeMultiplier.Commercial')
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage('Commercial multiplier must be between 0.1 and 5'),

  body('premiumRules.ageDepreciation')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Age depreciation must be between 0 and 20 percent'),

  body('premiumRules.coverageMultiplier')
    .optional()
    .isObject()
    .withMessage('Coverage multiplier must be an object'),

  body('premiumRules.coverageMultiplier.Third-Party')
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage('Third-Party multiplier must be between 0.1 and 5'),

  body('premiumRules.coverageMultiplier.Comprehensive')
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage('Comprehensive multiplier must be between 0.1 and 5'),

  body('premiumRules.coverageMultiplier.Own-Damage')
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage('Own-Damage multiplier must be between 0.1 and 5'),
];

// ─────────────────────────────────────────────
// Update Policy (Admin)
// ─────────────────────────────────────────────
export const updatePolicyValidator = [
  body('policyName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Policy name must be between 3 and 100 characters'),

  body('coverageType')
    .optional()
    .trim()
    .isIn(['Third-Party', 'Comprehensive', 'Own-Damage'])
    .withMessage('Coverage type must be Third-Party, Comprehensive, or Own-Damage'),

  body('policyDuration')
    .optional()
    .isIn([12, 24, 36])
    .withMessage('Policy duration must be 12, 24, or 36 months'),

  body('baseAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base amount must be a positive number'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('premiumRules')
    .optional()
    .isObject()
    .withMessage('Premium rules must be an object'),

  body('premiumRules.vehicleTypeMultiplier')
    .optional()
    .isObject()
    .withMessage('Vehicle type multiplier must be an object'),

  body('premiumRules.ageDepreciation')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Age depreciation must be between 0 and 20 percent'),

  body('premiumRules.coverageMultiplier')
    .optional()
    .isObject()
    .withMessage('Coverage multiplier must be an object'),
];

// ─────────────────────────────────────────────
// Purchase Policy (Customer)
// ─────────────────────────────────────────────
export const purchasePolicyValidator = [
  body('vehicleID')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isMongoId()
    .withMessage('Invalid Vehicle ID format'),
];

// ─────────────────────────────────────────────
// Policy ID Param
// ─────────────────────────────────────────────
export const policyIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Policy ID is required')
    .isMongoId()
    .withMessage('Invalid Policy ID format'),
];

// ─────────────────────────────────────────────
// Policy Query Params
// ─────────────────────────────────────────────
export const policyQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),

  query('coverageType')
    .optional()
    .isIn(['Third-Party', 'Comprehensive', 'Own-Damage', ''])
    .withMessage('Invalid coverage type filter'),

  query('policyDuration')
    .optional()
    .isIn(['12', '24', '36', ''])
    .withMessage('Invalid policy duration filter'),

  query('isActive')
    .optional()
    .isIn(['true', 'false', ''])
    .withMessage('isActive must be true or false'),

  query('sortBy')
    .optional()
    .isIn(['policyName', 'baseAmount', 'coverageType', 'policyDuration', 'createdAt', 'policyID'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('vehicleType')
    .optional()
    .isIn(['2-Wheeler', '4-Wheeler', 'Commercial', ''])
    .withMessage('Invalid vehicle type filter'),

  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be positive'),

  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be positive'),
];

// ─────────────────────────────────────────────
// Premium Calculate Preview
// ─────────────────────────────────────────────
export const calculatePremiumValidator = [
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
];