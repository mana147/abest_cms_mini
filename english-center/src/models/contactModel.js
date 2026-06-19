const { db } = require('../config/db');

const ContactModel = {
  getAll() {
    return db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
  },
  create(data) {
    return db.prepare(`INSERT INTO contacts (full_name, email, subject, phone, message)
      VALUES (@full_name, @email, @subject, @phone, @message)`).run(data);
  },
  markAsRead(id) {
    return db.prepare('UPDATE contacts SET is_read = 1 WHERE id = ?').run(id);
  },
  delete(id) {
    return db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
  },
  countUnread() {
    return db.prepare('SELECT COUNT(*) AS c FROM contacts WHERE is_read = 0').get().c;
  },
};

module.exports = ContactModel;
