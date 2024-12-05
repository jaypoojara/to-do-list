import express from 'express';
import { createUser, loginUser } from '../controllers/authController.js';
import { signupValidationRules, loginValidationRules } from '../middlewares/validateTask.js';
import validationHandler from '../middlewares/validationHandler.js';

const router = express.Router();

router.post('/signup', signupValidationRules, validationHandler, createUser);
router.post('/login', loginValidationRules, validationHandler, loginUser);

export default router;
