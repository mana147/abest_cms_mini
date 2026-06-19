const CourseModel = require('../models/courseModel');
const { slugify, makeUniqueSlug } = require('../utils/slugify');
const { safeUnlink } = require('../utils/safeFilePath');

const CourseController = {
  index(req, res) {
    res.render('web/courses', { title: 'Khóa học', courses: CourseModel.getPublished() });
  },
  show(req, res) {
    const course = CourseModel.findBySlug(req.params.slug);
    if (!course || course.status !== 'published') {
      return res.status(404).render('web/404', { title: 'Không tìm thấy' });
    }
    const otherCourses = CourseModel.getOtherCourses(course.id);
    res.render('web/course-detail', { title: course.title, course, otherCourses });
  },

  adminIndex(req, res) {
    res.render('admin/course-list', { activePage: 'courses', title: 'Khóa học', courses: CourseModel.getAll() });
  },
  adminCreateForm(req, res) {
    res.render('admin/course-create', { activePage: 'courses', title: 'Thêm khóa học' });
  },
  store(req, res) {
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/courses/create');
    }
    const { title, description, content, level, fee, duration, schedule, status, title_en, description_en, content_en } = req.body;
    if (!title?.trim()) {
      req.session.error = 'Tiêu đề không được để trống';
      return res.redirect('/admin/courses/create');
    }
    const slug = makeUniqueSlug(slugify(title), (s) => CourseModel.slugExists(s));
    const thumbnail = req.file ? '/uploads/images/' + req.file.filename : null;
    try {
      CourseModel.create({
        title: title.trim(), slug, description: description || null, content: content || null,
        level: level || null, fee: fee || null, duration: duration || null, schedule: schedule || null,
        thumbnail, status: status || 'draft',
        title_en: title_en || null, description_en: description_en || null, content_en: content_en || null,
      });
      req.session.success = 'Tạo khóa học thành công';
      return res.redirect('/admin/courses');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/courses/create');
    }
  },
  adminEditForm(req, res) {
    const course = CourseModel.findById(req.params.id);
    if (!course) {
      req.session.error = 'Không tìm thấy khóa học';
      return res.redirect('/admin/courses');
    }
    res.render('admin/course-edit', { activePage: 'courses', title: 'Sửa khóa học', course });
  },
  update(req, res) {
    const course = CourseModel.findById(req.params.id);
    if (!course) {
      req.session.error = 'Không tìm thấy khóa học';
      return res.redirect('/admin/courses');
    }
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect(`/admin/courses/${req.params.id}/edit`);
    }
    const { title, description, content, level, fee, duration, schedule, status, title_en, description_en, content_en } = req.body;
    if (!title?.trim()) {
      req.session.error = 'Tiêu đề không được để trống';
      return res.redirect(`/admin/courses/${req.params.id}/edit`);
    }
    const newSlug = slugify(title);
    const slug = course.slug === newSlug ? course.slug : makeUniqueSlug(newSlug, (s) => CourseModel.slugExists(s, course.id));
    const thumbnail = req.file ? '/uploads/images/' + req.file.filename : course.thumbnail;
    try {
      CourseModel.update(req.params.id, {
        title: title.trim(), slug, description: description || null, content: content || null,
        level: level || null, fee: fee || null, duration: duration || null, schedule: schedule || null,
        thumbnail, status: status || 'draft',
        title_en: title_en || null, description_en: description_en || null, content_en: content_en || null,
      });
      if (req.file && course.thumbnail) safeUnlink(course.thumbnail);
      req.session.success = 'Cập nhật thành công';
      return res.redirect('/admin/courses');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect(`/admin/courses/${req.params.id}/edit`);
    }
  },
  destroy(req, res) {
    const course = CourseModel.findById(req.params.id);
    if (!course) {
      req.session.error = 'Không tìm thấy khóa học';
      return res.redirect('/admin/courses');
    }
    safeUnlink(course.thumbnail);
    CourseModel.delete(req.params.id);
    req.session.success = 'Đã xóa khóa học';
    return res.redirect('/admin/courses');
  },
};

module.exports = CourseController;
