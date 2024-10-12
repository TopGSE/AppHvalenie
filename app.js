const User = require('./models/User'); 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const applyMiddleware = require('./middleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
applyMiddleware(app);
const PORT = process.env.PORT || 8888;
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/SOLOSDATABASE';

mongoose.connect(dbUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
    console.log('adminpage reached');
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admin/users', async (req, res) => {
	try {
        const users = await User.find({}, 'username');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.use('/auth', authRoutes);

app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/index');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
});

app.listen(PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
