const { db } = require('../config/db');

const CourseModel = {
  getAll() {
    return db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
  },
  getPublished() {
    return db.prepare("SELECT * FROM courses WHERE status = 'published' ORDER BY created_at DESC").all();
  },
  getLatest(limit = 3) {
    return db.prepare("SELECT * FROM courses WHERE status = 'published' ORDER BY created_at DESC LIMIT ?").all(limit);
  },
  findById(id) {
    return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  },
  findBySlug(slug) {
    return db.prepare('SELECT * FROM courses WHERE slug = ?').get(slug);
  },
  slugExists(slug, excludeId) {
    if (excludeId) {
      return !!db.prepare('SELECT 1 FROM courses WHERE slug = ? AND id != ?').get(slug, excludeId);
    }
    return !!db.prepare('SELECT 1 FROM courses WHERE slug = ?').get(slug);
  },
  getOtherCourses(excludeId, limit = 4) {
    return db.prepare("SELECT * FROM courses WHERE id != ? AND status = 'published' ORDER BY created_at DESC LIMIT ?").all(excludeId, limit);
  },
  create(data) {
    return db.prepare(`INSERT INTO courses
      (title, slug, description, content, level, fee, duration, schedule, thumbnail, status, title_en, description_en, content_en)
      VALUES (@title, @slug, @description, @content, @level, @fee, @duration, @schedule, @thumbnail, @status, @title_en, @description_en, @content_en)`
    ).run(data);
  },
  update(id, data) {
    return db.prepare(`UPDATE courses SET
      title=@title, slug=@slug, description=@description, content=@content, level=@level,
      fee=@fee, duration=@duration, schedule=@schedule, thumbnail=@thumbnail, status=@status,
      title_en=@title_en, description_en=@description_en, content_en=@content_en, updated_at=CURRENT_TIMESTAMP
      WHERE id=@id`
    ).run({ ...data, id });
  },
  delete(id) {
    return db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  },
};

module.exports = CourseModel;
