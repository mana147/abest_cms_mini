const express = require('express');
const router = express.Router();

const CourseModel = require('../models/courseModel');
const TeacherModel = require('../models/teacherModel');
const TestimonialModel = require('../models/testimonialModel');
const PostModel = require('../models/postModel');

const courseController = require('../controllers/courseController');
const teacherController = require('../controllers/teacherController');
const registrationController = require('../controllers/registrationController');
const postController = require('../controllers/postController');
const contactController = require('../controllers/contactController');
const documentController = require('../controllers/documentController');
const galleryController = require('../controllers/galleryController');
const menuController = require('../controllers/menuController');

const { verifyCsrf } = require('../middlewares/csrfMiddleware');

router.get('/', (req, res) => {
  res.render('web/home', {
    title: 'Trang chủ',
    courses: CourseModel.getLatest(5),
    teachers: TeacherModel.getActive().slice(0, 4),
    testimonials: TestimonialModel.getVisible(),
    posts: PostModel.getLatest(3),
  });
});

router.get('/about', (req, res) => {
  res.render('web/about', { title: 'Giới thiệu' });
});

router.get('/khoa-hoc', courseController.index);
router.get('/khoa-hoc/:slug', courseController.show);

router.get('/giao-vien', teacherController.index);

router.get('/lich-khai-giang', registrationController.index);
router.post('/dang-ky', verifyCsrf, registrationController.store);

router.get('/posts', postController.index);
router.get('/posts/:slug', postController.show);

router.get('/gallery', galleryController.index);

router.get('/documents', documentController.index);
router.get('/documents/:id/download', documentController.download);

router.get('/contact', contactController.index);
router.post('/contact', verifyCsrf, contactController.store);

router.get('/menu/:slug', menuController.show);

module.exports = router;
