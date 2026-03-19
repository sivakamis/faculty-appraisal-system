const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const { validate, registerValidation, loginValidation } = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, authUser);

module.exports = router;
