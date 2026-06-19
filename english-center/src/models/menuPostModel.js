const { db } = require('../config/db');

const MenuPostModel = {
  getPostIdsByMenuId(menuId) {
    return db.prepare('SELECT post_id FROM menu_posts WHERE menu_id = ? ORDER BY sort_order ASC').all(menuId).map((r) => r.post_id);
  },
  getPostsByMenuId(menuId) {
    return db.prepare(`SELECT p.* FROM menu_posts mp
      JOIN posts p ON p.id = mp.post_id
      WHERE mp.menu_id = ? AND p.status = 'published'
      ORDER BY mp.sort_order ASC`).all(menuId);
  },
  assignPostsToMenu(menuId, postIds) {
    const insert = db.prepare('INSERT INTO menu_posts (menu_id, post_id, sort_order) VALUES (?, ?, ?)');
    postIds.forEach((postId, index) => insert.run(menuId, postId, index));
  },
  removeAllPostsFromMenu(menuId) {
    return db.prepare('DELETE FROM menu_posts WHERE menu_id = ?').run(menuId);
  },
};

module.exports = MenuPostModel;
