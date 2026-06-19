const { db } = require('../config/db');

const MenuModel = {
  getAll() {
    return db.prepare('SELECT * FROM menus ORDER BY sort_order ASC').all();
  },
  getVisible() {
    return db.prepare('SELECT * FROM menus WHERE is_visible = 1 ORDER BY sort_order ASC').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM menus WHERE id = ?').get(id);
  },
  findBySlug(slug) {
    return db.prepare('SELECT * FROM menus WHERE slug = ?').get(slug);
  },
  slugExists(slug, excludeId) {
    if (excludeId) {
      return !!db.prepare('SELECT 1 FROM menus WHERE slug = ? AND id != ?').get(slug, excludeId);
    }
    return !!db.prepare('SELECT 1 FROM menus WHERE slug = ?').get(slug);
  },
  getNextSortOrder() {
    const row = db.prepare('SELECT MAX(sort_order) AS m FROM menus').get();
    return (row.m || 0) + 1;
  },
  create(data) {
    return db.prepare(`INSERT INTO menus (name_vi, name_en, slug, type, linked_post_id, url, is_visible, sort_order)
      VALUES (@name_vi, @name_en, @slug, @type, @linked_post_id, @url, @is_visible, @sort_order)`).run(data);
  },
  update(id, data) {
    return db.prepare(`UPDATE menus SET
      name_vi=@name_vi, name_en=@name_en, slug=@slug, type=@type, linked_post_id=@linked_post_id,
      url=@url, is_visible=@is_visible, sort_order=@sort_order
      WHERE id=@id`
    ).run({ ...data, id });
  },
  toggleVisibility(id) {
    return db.prepare('UPDATE menus SET is_visible = NOT is_visible WHERE id = ?').run(id);
  },
  updateSortOrder(id, sortOrder) {
    return db.prepare('UPDATE menus SET sort_order = ? WHERE id = ?').run(sortOrder, id);
  },
  delete(id) {
    return db.prepare('DELETE FROM menus WHERE id = ?').run(id);
  },
};

module.exports = MenuModel;
