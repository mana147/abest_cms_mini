const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const FileType = require('file-type');

const IMAGES_DIR = path.join(__dirname, '../../public/uploads/images');
const PDFS_DIR = path.join(__dirname, '../../public/uploads/pdfs');

function makeFilename(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const random = crypto.randomBytes(8).toString('hex');
  return `${Date.now()}-${random}${ext}`;
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => cb(null, makeFilename(file.originalname)),
});

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PDFS_DIR),
  filename: (req, file, cb) => cb(null, makeFilename(file.originalname)),
});

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

function imageFileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (IMAGE_MIME_TYPES.includes(file.mimetype) && IMAGE_EXTS.includes(ext)) {
    return cb(null, true);
  }
  cb(new Error('INVALID_IMAGE_TYPE'));
}

function pdfFileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/pdf' && ext === '.pdf') {
    return cb(null, true);
  }
  cb(new Error('INVALID_PDF_TYPE'));
}

const uploadImageRaw = multer({ storage: imageStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFileFilter }).single('thumbnail');
const uploadGalleryRaw = multer({ storage: imageStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFileFilter }).array('images', 20);
const uploadPdfRaw = multer({ storage: pdfStorage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: pdfFileFilter }).single('file');

function multerErrorMessage(err) {
  if (err.code === 'LIMIT_FILE_SIZE') return 'File vượt quá kích thước cho phép';
  if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') return 'Số lượng file vượt quá cho phép';
  if (err.message === 'INVALID_IMAGE_TYPE') return 'Chỉ chấp nhận file ảnh JPG, PNG, WEBP';
  if (err.message === 'INVALID_PDF_TYPE') return 'Chỉ chấp nhận file PDF';
  return 'Lỗi upload file';
}

async function verifyMagicBytes(file, expectedExts) {
  const type = await FileType.fromFile(file.path);
  if (!type || !expectedExts.includes(type.ext)) {
    fs.unlink(file.path, () => {});
    return false;
  }
  return true;
}

function wrapUpload(rawMiddleware, expectedExts, multiple) {
  return (req, res, next) => {
    rawMiddleware(req, res, async (err) => {
      if (err) {
        req.uploadError = multerErrorMessage(err);
        return next();
      }
      try {
        const files = multiple ? (req.files || []) : (req.file ? [req.file] : []);
        for (const file of files) {
          const ok = await verifyMagicBytes(file, expectedExts);
          if (!ok) {
            req.uploadError = 'File không hợp lệ (sai định dạng thực tế)';
            if (multiple) req.files = [];
            else req.file = undefined;
            break;
          }
        }
      } catch (e) {
        req.uploadError = 'Lỗi xử lý file';
      }
      next();
    });
  };
}

const uploadImage = wrapUpload(uploadImageRaw, ['jpg', 'png', 'webp'], false);
const uploadGallery = wrapUpload(uploadGalleryRaw, ['jpg', 'png', 'webp'], true);
const uploadPdf = wrapUpload(uploadPdfRaw, ['pdf'], false);

module.exports = { uploadImage, uploadGallery, uploadPdf };
