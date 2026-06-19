const crypto = require('crypto');

function csrfToken(req, res, next) {
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfSecret;
  next();
}

function verifyCsrf(req, res, next) {
  const sent = req.body && req.body._csrf;
  const expected = req.session.csrfSecret;
  const valid = !!sent && !!expected
    && Buffer.byteLength(sent) === Buffer.byteLength(expected)
    && crypto.timingSafeEqual(Buffer.from(sent), Buffer.from(expected));
  if (!valid) {
    req.session.error = 'Phiên làm việc không hợp lệ, vui lòng thử lại';
    return res.redirect(req.get('Referer') || '/');
  }
  next();
}

module.exports = { csrfToken, verifyCsrf };
