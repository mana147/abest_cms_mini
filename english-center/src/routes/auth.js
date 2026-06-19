const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.redirect('/admin/login'));
router.post('/logout', (req, res) => res.redirect('/admin/logout'));

module.exports = router;
