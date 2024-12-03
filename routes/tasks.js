const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getTaskCounts } = require('../controllers/taskController');
const { createTaskValidationRules, updateTaskValidationRules } = require('../middlewares/validateTask');
const validationHandler = require('../middlewares/validationHandler');
const authenticateToken = require('../middlewares/authMiddleware');

// POST route to create a task
router.post('/', authenticateToken, createTaskValidationRules, validationHandler, createTask);
router.put('/:id', authenticateToken, updateTaskValidationRules, validationHandler, updateTask);
router.get('/', authenticateToken, getTasks);
router.get('/counts', authenticateToken, getTaskCounts);
router.delete('/:id', authenticateToken, deleteTask); // Delete task

module.exports = router;
