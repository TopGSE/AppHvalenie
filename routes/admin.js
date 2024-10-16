const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/middleware');
const { isSuperAdmin } = require('../middleware/middleware');
const User = require('../models/User'); 

router.get('/users', isSuperAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'username role');
        res.json(users); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/admin', isAdmin, (req, res) => {
	res.render('admin', { username: req.session.username, role: req.session.role});
});

router.get('/manage-users', isAdmin, (req, res) => {
    const username = req.session.username || null;
    const flashMessages = req.flash('error');	
	res.render('manage-users', { username, flashMessages });
});

router.post('/promote-user', isSuperAdmin, async (req, res) => {
    const { userId, newrole } = req.body;

    // Validate the new role
    if (!['reader', 'admin', 'super-admin'].includes(newrole)) {
        req.flash('error', 'Invalid role');
        return res.redirect('/manage-users');
    }

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/manage-users');
        }

        // Update the user's role
        user.role = newrole;
        await user.save();

        // Set a success flash message
        req.flash('success', 'User role updated');
        res.redirect('/manage-users');
    } catch (error) {
        console.error('Error promoting user:', error);
        req.flash('error', 'Internal server error');
        res.redirect('/manage-users');
    }
});


module.exports = router;
