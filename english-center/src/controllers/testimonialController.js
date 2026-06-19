const TestimonialModel = require('../models/testimonialModel');
const { safeUnlink } = require('../utils/safeFilePath');

const TestimonialController = {
  adminIndex(req, res) {
    res.render('admin/testimonial-list', { activePage: 'testimonials', title: 'Cảm nhận học viên', testimonials: TestimonialModel.getAll() });
  },
  adminCreateForm(req, res) {
    res.render('admin/testimonial-create', { activePage: 'testimonials', title: 'Thêm cảm nhận' });
  },
  store(req, res) {
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/testimonials/create');
    }
    const { student_name, content, rating, course_name, content_en, is_visible, sort_order } = req.body;
    if (!student_name?.trim() || !content?.trim()) {
      req.session.error = 'Vui lòng nhập đầy đủ thông tin';
      return res.redirect('/admin/testimonials/create');
    }
    const avatar = req.file ? '/uploads/images/' + req.file.filename : null;
    try {
      TestimonialModel.create({
        student_name: student_name.trim(), avatar, content: content.trim(),
        rating: Number(rating) || 5, course_name: course_name || null, content_en: content_en || null,
        is_visible: is_visible ? 1 : 0, sort_order: Number(sort_order) || 0,
      });
      req.session.success = 'Thêm cảm nhận thành công';
      return res.redirect('/admin/testimonials');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/testimonials/create');
    }
  },
  adminEditForm(req, res) {
    const testimonial = TestimonialModel.findById(req.params.id);
    if (!testimonial) {
      req.session.error = 'Không tìm thấy cảm nhận';
      return res.redirect('/admin/testimonials');
    }
    res.render('admin/testimonial-edit', { activePage: 'testimonials', title: 'Sửa cảm nhận', testimonial });
  },
  update(req, res) {
    const testimonial = TestimonialModel.findById(req.params.id);
    if (!testimonial) {
      req.session.error = 'Không tìm thấy cảm nhận';
      return res.redirect('/admin/testimonials');
    }
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect(`/admin/testimonials/${req.params.id}/edit`);
    }
    const { student_name, content, rating, course_name, content_en, is_visible, sort_order } = req.body;
    if (!student_name?.trim() || !content?.trim()) {
      req.session.error = 'Vui lòng nhập đầy đủ thông tin';
      return res.redirect(`/admin/testimonials/${req.params.id}/edit`);
    }
    const avatar = req.file ? '/uploads/images/' + req.file.filename : testimonial.avatar;
    try {
      TestimonialModel.update(req.params.id, {
        student_name: student_name.trim(), avatar, content: content.trim(),
        rating: Number(rating) || 5, course_name: course_name || null, content_en: content_en || null,
        is_visible: is_visible ? 1 : 0, sort_order: Number(sort_order) || 0,
      });
      if (req.file && testimonial.avatar) safeUnlink(testimonial.avatar);
      req.session.success = 'Cập nhật thành công';
      return res.redirect('/admin/testimonials');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect(`/admin/testimonials/${req.params.id}/edit`);
    }
  },
  destroy(req, res) {
    const testimonial = TestimonialModel.findById(req.params.id);
    if (!testimonial) {
      req.session.error = 'Không tìm thấy cảm nhận';
      return res.redirect('/admin/testimonials');
    }
    safeUnlink(testimonial.avatar);
    TestimonialModel.delete(req.params.id);
    req.session.success = 'Đã xóa cảm nhận';
    return res.redirect('/admin/testimonials');
  },
};

module.exports = TestimonialController;
