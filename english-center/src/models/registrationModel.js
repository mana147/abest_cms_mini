const { db } = require('../config/db');

const RegistrationModel = {
  getAll() {
    return db.prepare(`SELECT r.*, c.title AS course_title FROM registrations r
      LEFT JOIN courses c ON c.id = r.course_id ORDER BY r.created_at DESC`).all();
  },
  findById(id) {
    return db.prepare(`SELECT r.*, c.title AS course_title FROM registrations r
      LEFT JOIN courses c ON c.id = r.course_id WHERE r.id = ?`).get(id);
  },
  create(data) {
    return db.prepare(`INSERT INTO registrations (full_name, email, phone, course_id, message)
      VALUES (@full_name, @email, @phone, @course_id, @message)`).run(data);
  },
  markAsRead(id) {
    return db.prepare('UPDATE registrations SET is_read = 1 WHERE id = ?').run(id);
  },
  delete(id) {
    return db.prepare('DELETE FROM registrations WHERE id = ?').run(id);
  },
  countUnread() {
    return db.prepare('SELECT COUNT(*) AS c FROM registrations WHERE is_read = 0').get().c;
  },
};

module.exports = RegistrationModel;
