const { db } = require('../config/db');

const TestimonialModel = {
  getAll() {
    return db.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC').all();
  },
  getVisible() {
    return db.prepare('SELECT * FROM testimonials WHERE is_visible = 1 ORDER BY sort_order ASC, created_at DESC').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
  },
  create(data) {
    return db.prepare(`INSERT INTO testimonials
      (student_name, avatar, content, rating, course_name, content_en, is_visible, sort_order)
      VALUES (@student_name, @avatar, @content, @rating, @course_name, @content_en, @is_visible, @sort_order)`
    ).run(data);
  },
  update(id, data) {
    return db.prepare(`UPDATE testimonials SET
      student_name=@student_name, avatar=@avatar, content=@content, rating=@rating,
      course_name=@course_name, content_en=@content_en, is_visible=@is_visible, sort_order=@sort_order
      WHERE id=@id`
    ).run({ ...data, id });
  },
  delete(id) {
    return db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
  },
};

module.exports = TestimonialModel;
