const { db } = require('../config/db');

const PostModel = {
  getAll() {
    return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  },
  getPublished() {
    return db.prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC").all();
  },
  getLatest(limit = 3) {
    return db.prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT ?").all(limit);
  },
  findById(id) {
    return db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  },
  findBySlug(slug) {
    return db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
  },
  slugExists(slug, excludeId) {
    if (excludeId) {
      return !!db.prepare('SELECT 1 FROM posts WHERE slug = ? AND id != ?').get(slug, excludeId);
    }
    return !!db.prepare('SELECT 1 FROM posts WHERE slug = ?').get(slug);
  },
  create(data) {
    return db.prepare(`INSERT INTO posts
      (title, slug, excerpt, content, thumbnail, status, title_en, excerpt_en, content_en)
      VALUES (@title, @slug, @excerpt, @content, @thumbnail, @status, @title_en, @excerpt_en, @content_en)`
    ).run(data);
  },
  update(id, data) {
    return db.prepare(`UPDATE posts SET
      title=@title, slug=@slug, excerpt=@excerpt, content=@content, thumbnail=@thumbnail, status=@status,
      title_en=@title_en, excerpt_en=@excerpt_en, content_en=@content_en, updated_at=CURRENT_TIMESTAMP
      WHERE id=@id`
    ).run({ ...data, id });
  },
  delete(id) {
    return db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  },
};

module.exports = PostModel;
