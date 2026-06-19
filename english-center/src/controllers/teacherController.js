const TeacherModel = require('../models/teacherModel');
const { slugify, makeUniqueSlug } = require('../utils/slugify');
const { safeUnlink } = require('../utils/safeFilePath');

const TeacherController = {
  index(req, res) {
    res.render('web/teachers', { title: 'Giáo viên', teachers: TeacherModel.getActive() });
  },

  adminIndex(req, res) {
    res.render('admin/teacher-list', { activePage: 'teachers', title: 'Giáo viên', teachers: TeacherModel.getAll() });
  },
  adminCreateForm(req, res) {
    res.render('admin/teacher-create', { activePage: 'teachers', title: 'Thêm giáo viên' });
  },
  store(req, res) {
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/teachers/create');
    }
    const { name, qualification, experience, bio, sort_order, status, qualification_en, bio_en } = req.body;
    if (!name?.trim()) {
      req.session.error = 'Tên giáo viên không được để trống';
      return res.redirect('/admin/teachers/create');
    }
    const slug = makeUniqueSlug(slugify(name), (s) => TeacherModel.slugExists(s));
    const photo = req.file ? '/uploads/images/' + req.file.filename : null;
    try {
      TeacherModel.create({
        name: name.trim(), slug, photo, qualification: qualification || null, experience: experience || null,
        bio: bio || null, sort_order: Number(sort_order) || 0, status: status || 'active',
        qualification_en: qualification_en || null, bio_en: bio_en || null,
      });
      req.session.success = 'Thêm giáo viên thành công';
      return res.redirect('/admin/teachers');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/teachers/create');
    }
  },
  adminEditForm(req, res) {
    const teacher = TeacherModel.findById(req.params.id);
    if (!teacher) {
      req.session.error = 'Không tìm thấy giáo viên';
      return res.redirect('/admin/teachers');
    }
    res.render('admin/teacher-edit', { activePage: 'teachers', title: 'Sửa giáo viên', teacher });
  },
  update(req, res) {
    const teacher = TeacherModel.findById(req.params.id);
    if (!teacher) {
      req.session.error = 'Không tìm thấy giáo viên';
      return res.redirect('/admin/teachers');
    }
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect(`/admin/teachers/${req.params.id}/edit`);
    }
    const { name, qualification, experience, bio, sort_order, status, qualification_en, bio_en } = req.body;
    if (!name?.trim()) {
      req.session.error = 'Tên giáo viên không được để trống';
      return res.redirect(`/admin/teachers/${req.params.id}/edit`);
    }
    const newSlug = slugify(name);
    const slug = teacher.slug === newSlug ? teacher.slug : makeUniqueSlug(newSlug, (s) => TeacherModel.slugExists(s, teacher.id));
    const photo = req.file ? '/uploads/images/' + req.file.filename : teacher.photo;
    try {
      TeacherModel.update(req.params.id, {
        name: name.trim(), slug, photo, qualification: qualification || null, experience: experience || null,
        bio: bio || null, sort_order: Number(sort_order) || 0, status: status || 'active',
        qualification_en: qualification_en || null, bio_en: bio_en || null,
      });
      if (req.file && teacher.photo) safeUnlink(teacher.photo);
      req.session.success = 'Cập nhật thành công';
      return res.redirect('/admin/teachers');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect(`/admin/teachers/${req.params.id}/edit`);
    }
  },
  destroy(req, res) {
    const teacher = TeacherModel.findById(req.params.id);
    if (!teacher) {
      req.session.error = 'Không tìm thấy giáo viên';
      return res.redirect('/admin/teachers');
    }
    safeUnlink(teacher.photo);
    TeacherModel.delete(req.params.id);
    req.session.success = 'Đã xóa giáo viên';
    return res.redirect('/admin/teachers');
  },
};

module.exports = TeacherController;
