import express from 'express';
import { modifyTask, removeTask, fetchTaskCounts, fetchTasks, addTask } from '../controllers/taskController.js';
import { createTaskValidationRules, updateTaskValidationRules } from '../middlewares/validateTask.js';
import validationHandler from '../middlewares/validationHandler.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTaskValidationRules, validationHandler, addTask);
router.put('/:id', authenticateToken, updateTaskValidationRules, validationHandler, modifyTask);
router.get('/', authenticateToken, fetchTasks);
router.get('/counts', authenticateToken, fetchTaskCounts);
router.delete('/:id', authenticateToken, removeTask);

export default router;
