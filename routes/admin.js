const express = require('express');
const router = express.Router();


router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});


module.exports = router;
