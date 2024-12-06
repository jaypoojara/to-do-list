import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { signupValidationRules, loginValidationRules } from '../middlewares/validateTask.js';
import validationHandler from '../middlewares/validationHandler.js';

const router = express.Router();

router.post('/signup', signupValidationRules, validationHandler, signup);
router.post('/login', loginValidationRules, validationHandler, login);

export default router;
