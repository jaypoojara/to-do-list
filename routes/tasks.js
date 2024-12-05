import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, getTaskCounts } from '../controllers/taskController.js';
import { createTaskValidationRules, updateTaskValidationRules } from '../middlewares/validateTask.js';
import validationHandler from '../middlewares/validationHandler.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTaskValidationRules, validationHandler, createTask);
router.put('/:id', authenticateToken, updateTaskValidationRules, validationHandler, updateTask);
router.get('/', authenticateToken, getTasks);
router.get('/counts', authenticateToken, getTaskCounts);
router.delete('/:id', authenticateToken, deleteTask);

export default router;
