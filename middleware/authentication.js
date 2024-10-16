const { validationResult } = require('express-validator');
const User = require('../models/User'); // Ensure this path is correct
const { registerValidation, loginValidation } = require('../public/js/validation'); // Ensure this path is correct

// Display the login page
const loginPage = (req, res) => {
    const flashMessages = req.flash('error'); // Retrieve flash messages from the session
    res.render('login', { flashMessages }); // Pass flash messages to the view
};

// Display the register page
const registerPage = (req, res) => {
    const flashMessages = req.flash('error'); // Retrieve flash messages from the session
    res.render('register', { flashMessages }); // Pass flash messages to the view
};

// Handle user registration
const registerUser = [
    ...registerValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(err => req.flash('error', err.msg)); // Store errors as flash messages
            return res.redirect('/register'); // Redirect to register page with errors
        }

        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                req.flash('error', 'User already exists. Please login.'); // Flash message for existing user
                return res.redirect('/auth/login'); // Redirect to login
            }

            const user = new User({ username, password, role: 'reader' });
            await user.save();
            res.redirect('/auth/login');
        } catch (error) {
            req.flash('error', 'User registration failed. Please try again.'); // Flash message for registration error
            res.redirect('/register'); // Redirect back to register page
        }
    }
];

// Handle user login
const loginUser = [
    ...loginValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(err => req.flash('error', err.msg)); // Store errors as flash messages
            return res.redirect('/login'); // Redirect to login page with errors
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                req.flash('error', 'User not found.'); // Flash message for user not found
                return res.redirect('/login');
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                req.flash('error', 'Invalid password.'); // Flash message for invalid password
                return res.redirect('/login');
            }

            // Store user information in session
            req.session.userId = user._id;
            req.session.role = user.role;
            req.session.username = user.username;

            // Redirect based on user role
            if (req.session.role === 'admin') {
                return res.redirect('/admin');
            }
            return res.redirect('/');
        } catch (error) {
            console.error('Login error:', error); // Log the error for debugging
            req.flash('error', 'Internal server error.'); // Flash message for server error
            return res.redirect('/login');
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
        res.redirect('/'); // Redirect to login after logout
    });
};

// Export controller functions
module.exports = {
    loginPage,
    registerPage,
    registerUser,
    loginUser,
    logoutUser
};
