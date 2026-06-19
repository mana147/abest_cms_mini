const vi = require('../locales/vi.json');
const en = require('../locales/en.json');

const locales = { vi, en };

function getNested(obj, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function languageMiddleware(req, res, next) {
  const lang = req.session.lang === 'en' ? 'en' : 'vi';
  const t = locales[lang];
  res.locals.lang = lang;
  res.locals.t = t;
  res.locals.__ = (key) => {
    const value = getNested(t, key);
    return value !== undefined ? value : key;
  };
  next();
}

module.exports = languageMiddleware;
