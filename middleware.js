const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/SOLOSDATABASE';

module.exports = (app) => {
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
                maxAge: 1000 * 60 * 60 * 24,
            },
        })
    );

    app.use(express.static(path.join(__dirname, 'public')));
};
