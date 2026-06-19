const CourseModel = require('../models/courseModel');
const TeacherModel = require('../models/teacherModel');
const RegistrationModel = require('../models/registrationModel');
const PostModel = require('../models/postModel');
const ContactModel = require('../models/contactModel');

const AdminController = {
  dashboard(req, res) {
    res.render('admin/dashboard', {
      activePage: 'dashboard',
      title: 'Dashboard',
      stats: {
        courses: CourseModel.getAll().length,
        teachers: TeacherModel.getAll().length,
        registrations: RegistrationModel.getAll().length,
        registrationsUnread: RegistrationModel.countUnread(),
        posts: PostModel.getAll().length,
        contactsUnread: ContactModel.countUnread(),
      },
    });
  },
};

module.exports = AdminController;
