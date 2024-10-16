const express = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../public/js/validation');

const router = express.Router();

// Display login page
router.get('/login', (req, res) => {
    const flashMessages = req.flash('error');
    res.render('login', { User, flashMessages });
});

// Display register page
router.get('/register', (req, res) => {
    const flashMessages = req.flash('error');
    res.render('register', { User, flashMessages });
});

// Handle user registration
router.post('/register', [
    ...registerValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(err => err.msg).join(' '));
            return res.redirect('/auth/register');
        }

        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                req.flash('error', 'User already exists. Please login.');
                return res.redirect('/auth/register');
            }

            const user = new User({ username, password, role: 'reader' });
            await user.save();
            req.flash('success', 'Registration successful! You can now login.');
            res.redirect('/auth/login');
        } catch (error) {
            req.flash('error', 'User registration failed. Please try again.');
            return res.redirect('/auth/register');
        }
    }
]);

// Handle user login
router.post('/login', [
    ...loginValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(err => err.msg).join(' '));
            return res.redirect('/auth/login');
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                req.flash('error', 'User not found.');
                return res.redirect('/auth/login');
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                req.flash('error', 'Invalid password.');
                return res.redirect('/auth/login');
            }

            req.session.userId = user._id;
            req.session.role = user.role;
            req.session.username = user.username;

            if (req.session.role === 'admin') {
                return res.redirect('/admin');
            }
            return res.redirect('/');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Internal server error. Please try again later.');
            return res.redirect('/auth/login');
        }
    }
]);

// Handle user logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
});

module.exports = router;
