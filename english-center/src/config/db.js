const path = require('path');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../../database/cms.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      content TEXT,
      level TEXT,
      fee TEXT,
      duration TEXT,
      schedule TEXT,
      thumbnail TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      title_en TEXT,
      description_en TEXT,
      content_en TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      photo TEXT,
      qualification TEXT,
      experience TEXT,
      bio TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      qualification_en TEXT,
      bio_en TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      course_id INTEGER,
      message TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      avatar TEXT,
      content TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      course_name TEXT,
      content_en TEXT,
      is_visible INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT,
      thumbnail TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      title_en TEXT,
      excerpt_en TEXT,
      content_en TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      alt_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT,
      subject TEXT,
      phone TEXT,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT,
      slug TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL DEFAULT 'custom',
      linked_post_id INTEGER,
      url TEXT,
      is_visible INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (linked_post_id) REFERENCES posts(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS menu_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      UNIQUE (menu_id, post_id)
    );
  `);
}

function seedAdmin() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, passwordHash, 'admin');
}

function seedMenus() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM menus').get().c;
  if (count > 0) return;
  const menus = [
    { name_vi: 'Trang chủ', name_en: 'Home', slug: '', type: 'system', url: '/', sort_order: 1 },
    { name_vi: 'Giới thiệu', name_en: 'About', slug: 'about', type: 'system', url: '/about', sort_order: 2 },
    { name_vi: 'Khóa học', name_en: 'Courses', slug: 'khoa-hoc', type: 'system', url: '/khoa-hoc', sort_order: 3 },
    { name_vi: 'Giáo viên', name_en: 'Teachers', slug: 'giao-vien', type: 'system', url: '/giao-vien', sort_order: 4 },
    { name_vi: 'Lịch khai giảng', name_en: 'Schedule', slug: 'lich-khai-giang', type: 'system', url: '/lich-khai-giang', sort_order: 5 },
    { name_vi: 'Tin tức', name_en: 'News', slug: 'posts', type: 'system', url: '/posts', sort_order: 6 },
    { name_vi: 'Thư viện', name_en: 'Gallery', slug: 'gallery', type: 'system', url: '/gallery', sort_order: 7 },
    { name_vi: 'Liên hệ', name_en: 'Contact', slug: 'contact', type: 'system', url: '/contact', sort_order: 8 },
  ];
  const insert = db.prepare('INSERT INTO menus (name_vi, name_en, slug, type, url, is_visible, sort_order) VALUES (?, ?, ?, ?, ?, 1, ?)');
  for (const m of menus) insert.run(m.name_vi, m.name_en, m.slug, m.type, m.url, m.sort_order);
}

function seedCourses() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM courses').get().c;
  if (count > 0) return;
  const courses = [
    {
      title: 'Tiếng Anh Giao Tiếp Cơ Bản', slug: 'tieng-anh-giao-tiep-co-ban',
      description: 'Khóa học dành cho người mới bắt đầu, xây dựng nền tảng giao tiếp tiếng Anh hàng ngày.',
      content: 'Khóa học gồm 40 buổi, tập trung vào kỹ năng nghe nói cơ bản, phát âm chuẩn và từ vựng giao tiếp thông dụng.',
      level: 'Cơ bản', fee: '2.500.000đ', duration: '3 tháng', schedule: 'Thứ 2-4-6, 18:00-20:00',
      status: 'published',
      title_en: 'Basic English Communication', description_en: 'A course for beginners to build everyday English communication skills.',
      content_en: 'A 40-session course focused on basic listening/speaking skills, accurate pronunciation, and common communication vocabulary.',
    },
    {
      title: 'IELTS Foundation', slug: 'ielts-foundation',
      description: 'Khóa học nền tảng IELTS cho học viên hướng đến mục tiêu 5.5 - 6.5.',
      content: 'Trang bị chiến lược làm bài 4 kỹ năng Listening, Reading, Writing, Speaking theo chuẩn IELTS.',
      level: 'Trung cấp', fee: '4.200.000đ', duration: '4 tháng', schedule: 'Thứ 3-5-7, 19:00-21:00',
      status: 'published',
      title_en: 'IELTS Foundation', description_en: 'A foundation IELTS course for students targeting band 5.5 - 6.5.',
      content_en: 'Equips strategies for all 4 IELTS skills: Listening, Reading, Writing, and Speaking.',
    },
    {
      title: 'TOEIC Intensive', slug: 'toeic-intensive',
      description: 'Khóa học luyện thi TOEIC cấp tốc, cam kết đầu ra 650+.',
      content: 'Luyện đề chuyên sâu, chiến thuật làm bài Listening & Reading theo format TOEIC mới nhất.',
      level: 'Trung cấp', fee: '3.800.000đ', duration: '2 tháng', schedule: 'Thứ 2-4-6, 19:00-21:00',
      status: 'published',
      title_en: 'TOEIC Intensive', description_en: 'An intensive TOEIC prep course, committed to a 650+ score.',
      content_en: 'Deep practice tests and test-taking strategies for Listening & Reading following the latest TOEIC format.',
    },
    {
      title: 'Tiếng Anh Trẻ Em', slug: 'tieng-anh-tre-em',
      description: 'Khóa học tiếng Anh vui nhộn cho trẻ từ 6-12 tuổi, phát triển 4 kỹ năng qua trò chơi.',
      content: 'Phương pháp học qua hình ảnh, âm nhạc và hoạt động tương tác giúp trẻ yêu thích tiếng Anh.',
      level: 'Thiếu nhi', fee: '1.800.000đ', duration: '3 tháng', schedule: 'Thứ 7-CN, 9:00-10:30',
      status: 'published',
      title_en: 'Kids English', description_en: 'A fun English course for kids aged 6-12, developing all 4 skills through games.',
      content_en: 'Learning through pictures, music, and interactive activities to help kids fall in love with English.',
    },
  ];
  const insert = db.prepare(`INSERT INTO courses
    (title, slug, description, content, level, fee, duration, schedule, status, title_en, description_en, content_en)
    VALUES (@title, @slug, @description, @content, @level, @fee, @duration, @schedule, @status, @title_en, @description_en, @content_en)`);
  for (const c of courses) insert.run(c);
}

function seedTeachers() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM teachers').get().c;
  if (count > 0) return;
  const teachers = [
    {
      name: 'Nguyễn Thị Hương', slug: 'nguyen-thi-huong',
      qualification: 'Thạc sĩ Ngôn ngữ Anh, IELTS 8.5', experience: '10 năm giảng dạy',
      bio: 'Cô Hương có 10 năm kinh nghiệm giảng dạy IELTS và giao tiếp, phong cách thân thiện, dễ hiểu.',
      sort_order: 1, status: 'active',
      qualification_en: 'M.A. in English Linguistics, IELTS 8.5',
      bio_en: 'Ms. Huong has 10 years of experience teaching IELTS and communication, with a friendly and easy-to-understand style.',
    },
    {
      name: 'Trần Văn Minh', slug: 'tran-van-minh',
      qualification: 'Cử nhân Sư phạm Anh, TOEIC 990', experience: '7 năm giảng dạy',
      bio: 'Thầy Minh chuyên luyện thi TOEIC, phương pháp giảng dạy bài bản, tận tâm với học viên.',
      sort_order: 2, status: 'active',
      qualification_en: 'B.A. in English Education, TOEIC 990',
      bio_en: 'Mr. Minh specializes in TOEIC prep, with a methodical teaching approach and dedication to students.',
    },
    {
      name: 'Lê Thị Mai', slug: 'le-thi-mai',
      qualification: 'Thạc sĩ TESOL', experience: '8 năm giảng dạy thiếu nhi',
      bio: 'Cô Mai yêu trẻ em, chuyên thiết kế các hoạt động học tiếng Anh sáng tạo và sinh động.',
      sort_order: 3, status: 'active',
      qualification_en: 'M.A. in TESOL',
      bio_en: 'Ms. Mai loves children and specializes in designing creative, lively English learning activities.',
    },
  ];
  const insert = db.prepare(`INSERT INTO teachers
    (name, slug, qualification, experience, bio, sort_order, status, qualification_en, bio_en)
    VALUES (@name, @slug, @qualification, @experience, @bio, @sort_order, @status, @qualification_en, @bio_en)`);
  for (const t of teachers) insert.run(t);
}

function seedTestimonials() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM testimonials').get().c;
  if (count > 0) return;
  const testimonials = [
    {
      student_name: 'Phạm Quốc Bảo', content: 'Học ở ABest 3 tháng, mình tự tin giao tiếp tiếng Anh hơn rất nhiều. Giáo viên nhiệt tình, dễ hiểu.',
      rating: 5, course_name: 'Tiếng Anh Giao Tiếp Cơ Bản', is_visible: 1, sort_order: 1,
      content_en: 'After 3 months at ABest, I feel much more confident communicating in English. The teachers are enthusiastic and easy to understand.',
    },
    {
      student_name: 'Đỗ Thu Trang', content: 'Nhờ khóa IELTS Foundation mà mình đạt 6.5 ngay lần thi đầu tiên. Cảm ơn ABest rất nhiều!',
      rating: 5, course_name: 'IELTS Foundation', is_visible: 1, sort_order: 2,
      content_en: 'Thanks to the IELTS Foundation course, I scored 6.5 on my first attempt. Thank you so much, ABest!',
    },
    {
      student_name: 'Vũ Hoàng Long', content: 'Khóa TOEIC Intensive giúp mình tăng điểm từ 450 lên 750 chỉ sau 2 tháng. Lộ trình học rất rõ ràng.',
      rating: 4, course_name: 'TOEIC Intensive', is_visible: 1, sort_order: 3,
      content_en: 'The TOEIC Intensive course helped me improve my score from 450 to 750 in just 2 months. The learning path is very clear.',
    },
  ];
  const insert = db.prepare(`INSERT INTO testimonials
    (student_name, content, rating, course_name, content_en, is_visible, sort_order)
    VALUES (@student_name, @content, @rating, @course_name, @content_en, @is_visible, @sort_order)`);
  for (const t of testimonials) insert.run(t);
}

function seedPosts() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM posts').get().c;
  if (count > 0) return;
  const posts = [
    {
      title: 'ABest English Center khai giảng khóa IELTS mới', slug: 'abest-khai-giang-khoa-ielts-moi',
      excerpt: 'Khóa IELTS Foundation tháng này chính thức khai giảng với nhiều ưu đãi hấp dẫn cho học viên đăng ký sớm.',
      content: 'ABest English Center thông báo khai giảng khóa IELTS Foundation mới, áp dụng ưu đãi học phí cho 20 học viên đăng ký sớm nhất...',
      status: 'published',
      title_en: 'ABest English Center launches new IELTS course',
      excerpt_en: 'The IELTS Foundation course launches this month with attractive offers for early registrants.',
      content_en: 'ABest English Center announces the launch of a new IELTS Foundation course, with tuition discounts for the first 20 early registrants...',
    },
    {
      title: '5 bí quyết học tiếng Anh hiệu quả mỗi ngày', slug: '5-bi-quyet-hoc-tieng-anh-hieu-qua',
      excerpt: 'Chia sẻ 5 phương pháp đơn giản giúp bạn cải thiện tiếng Anh mỗi ngày chỉ với 30 phút.',
      content: '1. Nghe podcast tiếng Anh mỗi ngày. 2. Luyện nói trước gương. 3. Ghi chú từ vựng theo chủ đề. 4. Xem phim có phụ đề tiếng Anh. 5. Luyện viết nhật ký ngắn...',
      status: 'published',
      title_en: '5 tips for effective daily English learning',
      excerpt_en: 'Sharing 5 simple methods to help you improve your English every day with just 30 minutes.',
      content_en: '1. Listen to English podcasts daily. 2. Practice speaking in front of a mirror. 3. Note vocabulary by topic. 4. Watch movies with English subtitles. 5. Practice writing a short diary...',
    },
    {
      title: 'ABest English Center đạt chứng nhận chất lượng đào tạo 2026', slug: 'abest-dat-chung-nhan-chat-luong-2026',
      excerpt: 'Trung tâm tự hào được công nhận là cơ sở đào tạo tiếng Anh uy tín năm 2026.',
      content: 'Với cam kết chất lượng giảng dạy và sự hài lòng của học viên, ABest English Center vừa được trao chứng nhận đào tạo uy tín...',
      status: 'published',
      title_en: 'ABest English Center receives 2026 training quality certification',
      excerpt_en: 'The center is proud to be recognized as a reputable English training institution in 2026.',
      content_en: 'With a commitment to teaching quality and student satisfaction, ABest English Center has just been awarded a reputable training certification...',
    },
  ];
  const insert = db.prepare(`INSERT INTO posts
    (title, slug, excerpt, content, status, title_en, excerpt_en, content_en)
    VALUES (@title, @slug, @excerpt, @content, @status, @title_en, @excerpt_en, @content_en)`);
  for (const p of posts) insert.run(p);
}

function initDatabase() {
  createSchema();
  seedAdmin();
  seedMenus();
  seedCourses();
  seedTeachers();
  seedTestimonials();
  seedPosts();
}

module.exports = { db, initDatabase };
