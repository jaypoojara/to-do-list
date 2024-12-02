// middleware/validateTask.js
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
    .withMessage('Due date must be a valid ISO 8601 date format'),
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
    .withMessage('Due date must be a valid ISO 8601 date format'),
];

module.exports = {
  createTaskValidationRules,
  updateTaskValidationRules,
};
