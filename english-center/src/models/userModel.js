const { db } = require('../config/db');

const UserModel = {
  findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },
  findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },
  changePassword(id, passwordHash) {
    return db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
  },
};

module.exports = UserModel;
