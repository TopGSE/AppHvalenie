const express = require('express');
const router = express.Router();
const { registerPage, loginPage, registerUser, loginUser, logoutUser } = require('../controllers/authControllers'); // Correct import
const path = require('path');

router.get('/login', loginPage);

router.get('/register', registerPage);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

module.exports = router;
