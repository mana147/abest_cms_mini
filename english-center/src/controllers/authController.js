const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const AuthController = {
  loginForm(req, res) {
    res.render('admin/login', { title: 'Đăng nhập' });
  },
  login(req, res) {
    const { username, password } = req.body;
    const user = UserModel.findByUsername((username || '').trim());
    if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
      req.session.error = 'Tài khoản hoặc mật khẩu không đúng';
      return res.redirect('/admin/login');
    }
    req.session.user = { id: user.id, username: user.username, role: user.role };
    return res.redirect('/admin');
  },
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/admin/login');
    });
  },
};

module.exports = AuthController;
