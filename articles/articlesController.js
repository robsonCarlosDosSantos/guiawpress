const express = require('express');
const router = express.Router();

router.get('/articles',(req, res) => {
    res.send('Articles');
});

router.get('/admin/articles',(req, res) => {
    res.send('Admin Articles');
});

module.exports = router;