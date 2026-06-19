const DocumentModel = require('../models/documentModel');
const { safeUnlink, safeResolve } = require('../utils/safeFilePath');

const DocumentController = {
  index(req, res) {
    res.render('web/documents', { title: 'Tài liệu', documents: DocumentModel.getAll() });
  },
  download(req, res) {
    const document = DocumentModel.findById(req.params.id);
    if (!document) {
      return res.status(404).render('web/404', { title: 'Không tìm thấy' });
    }
    const filePath = safeResolve(document.filepath);
    if (!filePath) {
      return res.status(404).render('web/404', { title: 'Không tìm thấy' });
    }
    res.download(filePath, document.filename);
  },

  adminIndex(req, res) {
    res.render('admin/document-list', { activePage: 'documents', title: 'Tài liệu', documents: DocumentModel.getAll() });
  },
  adminCreateForm(req, res) {
    res.render('admin/document-create', { activePage: 'documents', title: 'Thêm tài liệu' });
  },
  store(req, res) {
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/documents/create');
    }
    const { title, description } = req.body;
    if (!title?.trim() || !req.file) {
      req.session.error = 'Vui lòng nhập tiêu đề và chọn file PDF';
      return res.redirect('/admin/documents/create');
    }
    try {
      DocumentModel.create({
        title: title.trim(), filename: req.file.originalname,
        filepath: '/uploads/pdfs/' + req.file.filename, description: description || null,
      });
      req.session.success = 'Thêm tài liệu thành công';
      return res.redirect('/admin/documents');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/documents/create');
    }
  },
  destroy(req, res) {
    const document = DocumentModel.findById(req.params.id);
    if (!document) {
      req.session.error = 'Không tìm thấy tài liệu';
      return res.redirect('/admin/documents');
    }
    safeUnlink(document.filepath);
    DocumentModel.delete(req.params.id);
    req.session.success = 'Đã xóa tài liệu';
    return res.redirect('/admin/documents');
  },
};

module.exports = DocumentController;
