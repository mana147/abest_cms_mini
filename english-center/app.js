require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');

const { initDatabase } = require('./src/config/db');
const { csrfToken } = require('./src/middlewares/csrfMiddleware');
const languageMiddleware = require('./src/middlewares/languageMiddleware');
const menuMiddleware = require('./src/middlewares/menuMiddleware');

const langRoutes = require('./src/routes/language');
const webRoutes = require('./src/routes/web');
const adminRoutes = require('./src/routes/admin');
const authRoutes = require('./src/routes/auth');

initDatabase();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

app.use((req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  res.locals.user = req.session.user;
  delete req.session.success;
  delete req.session.error;
  next();
});

app.use(csrfToken);
app.use(languageMiddleware);
app.use(menuMiddleware);

app.use('/lang', langRoutes);
app.use('/', webRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).render('web/404', { title: 'Không tìm thấy' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('web/error', { title: 'Có lỗi xảy ra', error: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ABest English Center server running at http://localhost:${PORT}`);
});
