const express = require('express');
const router = express.Router();

router.get('/categories',(req, res) => {
    res.send('Categories');
});

router.get('/admin/categories',(req, res) => {
    res.send('Admin Categories');
});

module.exports = router;