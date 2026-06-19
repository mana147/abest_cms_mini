const { db } = require('../config/db');

const TeacherModel = {
  getAll() {
    return db.prepare('SELECT * FROM teachers ORDER BY sort_order ASC, created_at DESC').all();
  },
  getActive() {
    return db.prepare("SELECT * FROM teachers WHERE status = 'active' ORDER BY sort_order ASC, created_at DESC").all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
  },
  findBySlug(slug) {
    return db.prepare('SELECT * FROM teachers WHERE slug = ?').get(slug);
  },
  slugExists(slug, excludeId) {
    if (excludeId) {
      return !!db.prepare('SELECT 1 FROM teachers WHERE slug = ? AND id != ?').get(slug, excludeId);
    }
    return !!db.prepare('SELECT 1 FROM teachers WHERE slug = ?').get(slug);
  },
  create(data) {
    return db.prepare(`INSERT INTO teachers
      (name, slug, photo, qualification, experience, bio, sort_order, status, qualification_en, bio_en)
      VALUES (@name, @slug, @photo, @qualification, @experience, @bio, @sort_order, @status, @qualification_en, @bio_en)`
    ).run(data);
  },
  update(id, data) {
    return db.prepare(`UPDATE teachers SET
      name=@name, slug=@slug, photo=@photo, qualification=@qualification, experience=@experience,
      bio=@bio, sort_order=@sort_order, status=@status, qualification_en=@qualification_en, bio_en=@bio_en,
      updated_at=CURRENT_TIMESTAMP
      WHERE id=@id`
    ).run({ ...data, id });
  },
  delete(id) {
    return db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
  },
};

module.exports = TeacherModel;
