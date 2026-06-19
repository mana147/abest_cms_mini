const { db } = require('../config/db');

const GalleryModel = {
  getAll() {
    return db.prepare('SELECT * FROM gallery_images ORDER BY created_at DESC').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(id);
  },
  create(data) {
    return db.prepare('INSERT INTO gallery_images (filename, filepath, alt_text) VALUES (@filename, @filepath, @alt_text)').run(data);
  },
  delete(id) {
    return db.prepare('DELETE FROM gallery_images WHERE id = ?').run(id);
  },
};

module.exports = GalleryModel;
