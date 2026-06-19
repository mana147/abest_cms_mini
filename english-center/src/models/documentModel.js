const { db } = require('../config/db');

const DocumentModel = {
  getAll() {
    return db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
  },
  create(data) {
    return db.prepare('INSERT INTO documents (title, filename, filepath, description) VALUES (@title, @filename, @filepath, @description)').run(data);
  },
  delete(id) {
    return db.prepare('DELETE FROM documents WHERE id = ?').run(id);
  },
};

module.exports = DocumentModel;
