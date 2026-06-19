const GalleryModel = require('../models/galleryModel');
const { safeUnlink } = require('../utils/safeFilePath');

const GalleryController = {
  index(req, res) {
    res.render('web/gallery', { title: 'Thư viện ảnh', images: GalleryModel.getAll() });
  },

  adminIndex(req, res) {
    res.render('admin/gallery', { activePage: 'gallery', title: 'Thư viện ảnh', images: GalleryModel.getAll() });
  },
  store(req, res) {
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/gallery');
    }
    const files = req.files || [];
    if (!files.length) {
      req.session.error = 'Vui lòng chọn ít nhất 1 ảnh';
      return res.redirect('/admin/gallery');
    }
    try {
      files.forEach((file) => {
        GalleryModel.create({ filename: file.originalname, filepath: '/uploads/images/' + file.filename, alt_text: null });
      });
      req.session.success = `Đã tải lên ${files.length} ảnh`;
      return res.redirect('/admin/gallery');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/gallery');
    }
  },
  destroy(req, res) {
    const image = GalleryModel.findById(req.params.id);
    if (!image) {
      req.session.error = 'Không tìm thấy ảnh';
      return res.redirect('/admin/gallery');
    }
    safeUnlink(image.filepath);
    GalleryModel.delete(req.params.id);
    req.session.success = 'Đã xóa ảnh';
    return res.redirect('/admin/gallery');
  },
};

module.exports = GalleryController;
