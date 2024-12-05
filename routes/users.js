const express = require('express');
const router = express.Router();
const {createUser, loginUser} = require('../controllers/authController');
const { signupValidationRules, loginValidationRules } = require('../middlewares/validateTask');
const validationHandler = require('../middlewares/validationHandler');

router.post('/signup', signupValidationRules, validationHandler, createUser);
router.post('/login', loginValidationRules, validationHandler, loginUser);

module.exports = router;
