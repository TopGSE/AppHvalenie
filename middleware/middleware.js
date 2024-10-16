const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require('connect-flash'); // Import connect-flash
const dotenv = require('dotenv');

dotenv.config();

const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === "admin") {
        return next();
    }
    req.flash('error', 'You are not admin :('); // Flash message for admin check
    res.redirect('/index'); // Adjust the redirect path as needed
};

const isSuperAdmin = (req, res, next) => {
    if (req.session && req.session.role === "super-admin") {
        return next();
    }
    req.flash('error', 'You are not Super-Admin :('); // Flash message for super admin check
    res.redirect('/'); // Adjust the redirect path as needed
};

const attachUser = (req, res, next) => {
    if (req.session.userId) {
        req.user = {
            id: req.session.userId,
            role: req.session.role,
            username: req.session.username,
        };
    }
    next();
};

const applyMiddleware = (app) => {
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/SOLOSDATABASE';

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'VERYSECRETKEY',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: dbUri,
                collectionName: 'sessions',
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
            },
        })
    );

    app.use(flash()); // Initialize connect-flash
    app.use(express.static(path.join(__dirname, '../public')));
};

module.exports = { isAdmin, applyMiddleware, attachUser, isSuperAdmin };
