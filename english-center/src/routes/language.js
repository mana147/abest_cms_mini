const express = require('express');
const router = express.Router();

router.get('/:lang', (req, res) => {
  const lang = req.params.lang === 'en' ? 'en' : 'vi';
  req.session.lang = lang;
  res.redirect(req.get('Referer') || '/');
});

module.exports = router;
