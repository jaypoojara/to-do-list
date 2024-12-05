const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getTaskCounts } = require('../controllers/taskController');
const { createTaskValidationRules, updateTaskValidationRules } = require('../middlewares/validateTask');
const validationHandler = require('../middlewares/validationHandler');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, createTaskValidationRules, validationHandler, createTask);
router.put('/:id', authenticateToken, updateTaskValidationRules, validationHandler, updateTask);
router.get('/', authenticateToken, getTasks);
router.get('/counts', authenticateToken, getTaskCounts);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
