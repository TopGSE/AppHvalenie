const { body } = require('express-validator');

const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters.')
        .isAlphanumeric().withMessage('Username must be alphanumeric.'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];

const loginValidation = [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
];

module.exports = {
    registerValidation,
    loginValidation,
};
