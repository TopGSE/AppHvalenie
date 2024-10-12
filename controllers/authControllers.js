const path = require('path');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../public/js/validation');

// Display login page
const loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

// Display register page
const registerPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
};

// Handle user registration
const registerUser = [
    ...registerValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists. Please login.' });
            }

            const user = new User({ username, password, role: 'reader' });
            await user.save();
            res.redirect('/auth/login');
        } catch (error) {
            res.status(400).json({ error: 'User registration failed. Please try again.' });
        }
    }
];

// Handle user login
const loginUser = [
    ...loginValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) return res.status(404).json({ error: 'User not found.' });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid password.' });

            req.session.userId = user._id;
            req.session.role = user.role;

            if (req.session.role === 'admin') {
                return res.redirect('/admin');
            }
            return res.redirect('/');
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
];

// Handle user logout
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/index');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
};

module.exports = {
    loginPage,
    registerPage,
    registerUser,
    loginUser,
    logoutUser
};
