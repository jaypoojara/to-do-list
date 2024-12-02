var express = require('express');
var router = express.Router();
const {createUser, loginUser} = require('../controllers/authController');

router.post('/signup', createUser);
router.post('/login', loginUser);

module.exports = router;
