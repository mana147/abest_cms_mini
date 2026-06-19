const ContactModel = require('../models/contactModel');

const ContactController = {
  index(req, res) {
    res.render('web/contact', { title: 'Liên hệ' });
  },
  store(req, res) {
    const { full_name, email, subject, phone, message } = req.body;
    if (!full_name?.trim() || !message?.trim()) {
      req.session.error = 'Vui lòng nhập đầy đủ thông tin';
      return res.redirect('/contact');
    }
    try {
      ContactModel.create({
        full_name: full_name.trim(), email: email || null, subject: subject || null,
        phone: phone || null, message: message.trim(),
      });
      req.session.success = 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.';
      return res.redirect('/contact');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra, vui lòng thử lại';
      return res.redirect('/contact');
    }
  },

  adminIndex(req, res) {
    res.render('admin/contact-list', { activePage: 'contacts', title: 'Liên hệ', contacts: ContactModel.getAll() });
  },
  show(req, res) {
    const contact = ContactModel.findById(req.params.id);
    if (!contact) {
      req.session.error = 'Không tìm thấy liên hệ';
      return res.redirect('/admin/contacts');
    }
    if (!contact.is_read) ContactModel.markAsRead(req.params.id);
    res.render('admin/contact-detail', { activePage: 'contacts', title: 'Chi tiết liên hệ', contact });
  },
  destroy(req, res) {
    const contact = ContactModel.findById(req.params.id);
    if (!contact) {
      req.session.error = 'Không tìm thấy liên hệ';
      return res.redirect('/admin/contacts');
    }
    ContactModel.delete(req.params.id);
    req.session.success = 'Đã xóa liên hệ';
    return res.redirect('/admin/contacts');
  },
};

module.exports = ContactController;
