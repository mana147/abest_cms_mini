function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.redirect('/admin/login');
}

function redirectIfAuth(req, res, next) {
  if (req.session.user) return res.redirect('/admin');
  return next();
}

module.exports = { requireAuth, redirectIfAuth };
