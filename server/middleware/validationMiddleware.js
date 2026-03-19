const { check, validationResult } = require('express-validator');

// Error handling middleware for validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('department', 'Department is required').not().isEmpty(),
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

const appraisalValidation = [
    check('academic_year', 'Academic year is required').not().isEmpty()
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    appraisalValidation
};
