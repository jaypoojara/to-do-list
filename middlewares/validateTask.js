const { body } = require('express-validator');

const createTaskValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date format'),
];

const updateTaskValidationRules = [
  body('title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean value'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date format'),
];

const signupValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ max: 255 })
    .withMessage('Username cannot exceed 255 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 50 })
    .withMessage('Password must be between 6 and 50 characters long'),
];

const loginValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = {
  createTaskValidationRules,
  updateTaskValidationRules,
  signupValidationRules,
  loginValidationRules,
};
