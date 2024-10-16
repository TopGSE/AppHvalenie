const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const authRoutes = require('./controllers/authControllers'); 
const adminRoutes = require('./routes/admin'); 
const { applyMiddleware, isAdmin, attachUser, isSuperAdmin} = require('./middleware/middleware');
const { logoutUser } = require('./middleware/authentication');

dotenv.config();
const app = express();
applyMiddleware(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 8888;
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/SOLOSDATABASE';

mongoose.connect(dbUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(attachUser);

app.get('/', (req, res) => {
    try {
        const user = req.session.username ? { username: req.session.username } : null;
        const flashMessages = req.flash('error');
        res.render('index', { user, flashMessages });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.get('/admin', isAdmin, (req, res) => {
	res.render('admin', { username: req.session.username, role: req.session.role });
});

app.get('/logout', logoutUser);

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);


app.get('/manage-users', isSuperAdmin, (req, res) => {
    const username = req.session.username || null;
    const flashMessages = req.flash('error');
    res.render('manage-users', { username, flashMessages });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
