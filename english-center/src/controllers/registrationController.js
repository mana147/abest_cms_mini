const RegistrationModel = require('../models/registrationModel');
const CourseModel = require('../models/courseModel');

const RegistrationController = {
  index(req, res) {
    res.render('web/schedule', { title: 'Lịch khai giảng', courses: CourseModel.getPublished() });
  },
  store(req, res) {
    const { full_name, email, phone, course_id, message } = req.body;
    if (!full_name?.trim() || !phone?.trim()) {
      req.session.error = 'Vui lòng nhập đầy đủ họ tên và số điện thoại';
      return res.redirect('/lich-khai-giang');
    }
    try {
      RegistrationModel.create({
        full_name: full_name.trim(), email: email || null, phone: phone.trim(),
        course_id: course_id ? Number(course_id) : null, message: message || null,
      });
      req.session.success = 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.';
      return res.redirect('/lich-khai-giang');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra, vui lòng thử lại';
      return res.redirect('/lich-khai-giang');
    }
  },

  adminIndex(req, res) {
    res.render('admin/registration-list', { activePage: 'registrations', title: 'Đăng ký học', registrations: RegistrationModel.getAll() });
  },
  show(req, res) {
    const registration = RegistrationModel.findById(req.params.id);
    if (!registration) {
      req.session.error = 'Không tìm thấy đăng ký';
      return res.redirect('/admin/registrations');
    }
    if (!registration.is_read) RegistrationModel.markAsRead(req.params.id);
    res.render('admin/registration-detail', { activePage: 'registrations', title: 'Chi tiết đăng ký', registration });
  },
  destroy(req, res) {
    const registration = RegistrationModel.findById(req.params.id);
    if (!registration) {
      req.session.error = 'Không tìm thấy đăng ký';
      return res.redirect('/admin/registrations');
    }
    RegistrationModel.delete(req.params.id);
    req.session.success = 'Đã xóa đăng ký';
    return res.redirect('/admin/registrations');
  },
};

module.exports = RegistrationController;
