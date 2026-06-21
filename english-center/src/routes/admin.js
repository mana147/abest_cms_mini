const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { requireAuth, redirectIfAuth } = require('../middlewares/authMiddleware');
const { verifyCsrf } = require('../middlewares/csrfMiddleware');
const { uploadImage, uploadGallery, uploadPdf } = require('../middlewares/uploadMiddleware');

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const teacherController = require('../controllers/teacherController');
const registrationController = require('../controllers/registrationController');
const testimonialController = require('../controllers/testimonialController');
const postController = require('../controllers/postController');
const contactController = require('../controllers/contactController');
const documentController = require('../controllers/documentController');
const galleryController = require('../controllers/galleryController');
const menuController = require('../controllers/menuController');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

// --- Public-facing admin auth routes (before requireAuth) ---
router.get('/login', redirectIfAuth, authController.loginForm);
router.post('/login', redirectIfAuth, loginLimiter, verifyCsrf, authController.login);
router.post('/logout', authController.logout);

// --- Everything below requires authentication ---
router.use(requireAuth);

router.get('/', adminController.dashboard);

// Courses
router.get('/courses', courseController.adminIndex);
router.get('/courses/create', courseController.adminCreateForm);
router.post('/courses', uploadImage, verifyCsrf, courseController.store);
router.get('/courses/:id/edit', courseController.adminEditForm);
router.post('/courses/:id', uploadImage, verifyCsrf, courseController.update);
router.post('/courses/:id/delete', verifyCsrf, courseController.destroy);

// Teachers
router.get('/teachers', teacherController.adminIndex);
router.get('/teachers/create', teacherController.adminCreateForm);
router.post('/teachers', uploadImage, verifyCsrf, teacherController.store);
router.get('/teachers/:id/edit', teacherController.adminEditForm);
router.post('/teachers/:id', uploadImage, verifyCsrf, teacherController.update);
router.post('/teachers/:id/delete', verifyCsrf, teacherController.destroy);

// Registrations (view + delete only)
router.get('/registrations', registrationController.adminIndex);
router.get('/registrations/:id', registrationController.show);
router.post('/registrations/:id/delete', verifyCsrf, registrationController.destroy);

// Testimonials
router.get('/testimonials', testimonialController.adminIndex);
router.get('/testimonials/create', testimonialController.adminCreateForm);
router.post('/testimonials', uploadImage, verifyCsrf, testimonialController.store);
router.get('/testimonials/:id/edit', testimonialController.adminEditForm);
router.post('/testimonials/:id', uploadImage, verifyCsrf, testimonialController.update);
router.post('/testimonials/:id/delete', verifyCsrf, testimonialController.destroy);

// Posts
router.get('/posts', postController.adminIndex);
router.get('/posts/create', postController.adminCreateForm);
router.post('/posts', uploadImage, verifyCsrf, postController.store);
router.get('/posts/:id/edit', postController.adminEditForm);
router.post('/posts/:id', uploadImage, verifyCsrf, postController.update);
router.post('/posts/:id/delete', verifyCsrf, postController.destroy);

// Contacts (view + delete only)
router.get('/contacts', contactController.adminIndex);
router.get('/contacts/:id', contactController.show);
router.post('/contacts/:id/delete', verifyCsrf, contactController.destroy);

// Documents (create + delete only, no edit)
router.get('/documents', documentController.adminIndex);
router.get('/documents/create', documentController.adminCreateForm);
router.post('/documents', uploadPdf, verifyCsrf, documentController.store);
router.post('/documents/:id/delete', verifyCsrf, documentController.destroy);

// Gallery (upload + delete only, no edit)
router.get('/gallery', galleryController.adminIndex);
router.post('/gallery', uploadGallery, verifyCsrf, galleryController.store);
router.post('/gallery/:id/delete', verifyCsrf, galleryController.destroy);

// Menus (full CRUD + reorder + visibility toggle)
router.get('/menus', menuController.adminIndex);
router.get('/menus/create', menuController.adminCreateForm);
router.post('/menus', verifyCsrf, menuController.store);
router.get('/menus/:id/edit', menuController.adminEditForm);
router.post('/menus/:id', verifyCsrf, menuController.update);
router.post('/menus/:id/delete', verifyCsrf, menuController.destroy);
router.post('/menus/:id/toggle', verifyCsrf, menuController.toggleVisibility);
router.post('/menus/:id/move-up', verifyCsrf, menuController.moveUp);
router.post('/menus/:id/move-down', verifyCsrf, menuController.moveDown);

module.exports = router;
