# CLAUDE.md

This file provides guidance to Claude Code when working with this repository. It is the **single source of truth** — all architecture, schema, conventions, and rules are here.

> **Origin:** Project này tái sử dụng kiến trúc của `mini-cms` (CMS cảng MPC) cho domain **Trung tâm tiếng Anh**. Giữ nguyên toàn bộ stack & convention kỹ thuật, chỉ đổi các thực thể nghiệp vụ (port → giáo dục).

## Repository Layout

- **`english-center/`** — Node.js/Express CMS với EJS server-rendered views và SQLite. Ứng dụng chính.
  - `public/vendor/` — Vendored Bootstrap 5, Bootstrap Icons, Font Awesome 6 (fully offline, no CDN).
- **`view-html/`** — (tùy chọn) Static HTML/CSS/JS prototypes dùng làm design reference. No build step.

## Commands

```bash
cd english-center
npm install        # Install deps
npm run dev        # Start with nodemon (auto-reload)
npm start          # Production start
```

No test suite, no linter, no build step. Default admin: `admin` / `admin123` at `/admin/login`.

### Dependencies

`express`, `ejs`, `better-sqlite3`, `express-session`, `multer`, `bcrypt`, `dotenv`, `helmet`, `express-rate-limit`, `file-type`. Dev: `nodemon`.

---

## Architecture (english-center)

### MVC Pattern

```
app.js → middleware chain → routes/ → controllers/ → models/ → config/db.js (better-sqlite3)
                                                        ↓
                                                     views/ (EJS)
```

### Middleware Order (load-bearing — do NOT reorder)

`urlencoded → json → static → session → flash-clear → languageMiddleware → menuMiddleware → routes`

### Route Mounting Order (as in app.js)

`/lang/*` → `/*` (public web) → `/admin/*` (protected by `requireAuth`) → `/auth/*`

### Folder Structure

```
english-center/
├── app.js                        # Entry point, middleware chain, route mounting, error handlers
├── database/cms.sqlite           # SQLite database file (auto-created)
├── public/
│   ├── css/
│   │   ├── style.css             # CSS cho admin pages — NOT used by public pages
│   │   ├── base.css              # Shared styles: fonts, variables, buttons, forms, page components
│   │   ├── header.css            # Public header (responsive nav)
│   │   ├── footer.css            # Public footer
│   │   └── pages/
│   │       ├── landing.css       # Trang chủ CSS
│   │       ├── courses.css       # Danh sách khóa học CSS
│   │       ├── course-detail.css # Chi tiết khóa học CSS
│   │       ├── teachers.css      # Trang giáo viên CSS
│   │       ├── schedule.css      # Lịch khai giảng + form đăng ký CSS
│   │       ├── about.css         # Trang giới thiệu CSS
│   │       └── contact.css       # Trang liên hệ CSS
│   ├── fonts/                    # Local fonts
│   ├── images/
│   │   ├── logo.png              # Logo trung tâm
│   │   ├── homepage-hero-bg.png  # Background hero trang chủ
│   │   ├── homepage-method.png   # Ảnh minh họa section "Phương pháp luyện thi"
│   │   └── icons/                # SVG icons
│   ├── js/
│   │   ├── main.js               # Admin: auto-hide alerts, confirm delete, thumbnail preview
│   │   └── landing.js            # Public: mobile menu, carousels, testimonial slider
│   ├── uploads/
│   │   ├── images/               # Uploaded images (flat, multer saves here)
│   │   └── pdfs/                 # Uploaded PDF files
│   └── vendor/                   # Offline vendor libs (no CDN required)
│       ├── bootstrap/
│       │   ├── css/bootstrap.min.css
│       │   └── js/bootstrap.bundle.min.js
│       ├── bootstrap-icons/
│       │   ├── bootstrap-icons.css
│       │   └── fonts/
│       └── font-awesome/
│           ├── css/all.min.css
│           └── webfonts/
└── src/
    ├── config/db.js              # DB init & schema (CREATE TABLE IF NOT EXISTS), seed data, PRAGMA foreign_keys = ON
    ├── controllers/              # Request handlers (public + admin* in same file)
    │   ├── adminController.js        # Dashboard (stats: courses, teachers, registrations, posts...)
    │   ├── authController.js         # Login/logout (bcrypt)
    │   ├── courseController.js       # Course full CRUD + public list/detail (bilingual)
    │   ├── teacherController.js      # Teacher full CRUD + public list (bilingual)
    │   ├── registrationController.js # Đăng ký học (public form) + admin view/delete
    │   ├── testimonialController.js  # Cảm nhận học viên CRUD (bilingual)
    │   ├── postController.js         # Post/News full CRUD (bilingual)
    │   ├── contactController.js      # Contact form + admin CRUD
    │   ├── documentController.js     # Document upload/download + admin (no edit)
    │   ├── galleryController.js      # Gallery view + admin upload/delete (no edit)
    │   └── menuController.js         # Menu CRUD + visibility toggle + reorder + public page
    ├── middlewares/
    │   ├── authMiddleware.js     # requireAuth, redirectIfAuth
    │   ├── languageMiddleware.js # i18n (lang, t, __)
    │   ├── menuMiddleware.js     # loadMenus → res.locals.visibleMenus
    │   └── uploadMiddleware.js   # Multer (uploadImage, uploadGallery, uploadPdf)
    ├── models/                   # DB operations (SYNC — no async/await!)
    │   ├── userModel.js          # users table + auth (changePassword)
    │   ├── courseModel.js        # courses table (full CRUD + getOtherCourses for sidebar)
    │   ├── teacherModel.js       # teachers table (full CRUD)
    │   ├── registrationModel.js  # registrations table (create + read + delete; countUnread)
    │   ├── testimonialModel.js   # testimonials table (full CRUD + getVisible)
    │   ├── postModel.js          # posts table
    │   ├── contactModel.js       # contacts table (countUnread)
    │   ├── documentModel.js      # documents table (read-only after create)
    │   ├── galleryModel.js       # gallery_images table
    │   ├── menuModel.js          # menus table
    │   └── menuPostModel.js      # menu_posts junction (getPostIdsByMenuId, assignPostsToMenu, removeAllPostsFromMenu)
    ├── routes/
    │   ├── admin.js              # Protected admin routes (login/logout before requireAuth, rest after)
    │   ├── auth.js               # Simple redirects: /auth/login → /admin/login
    │   ├── language.js           # GET /lang/:lang — switch language via session
    │   └── web.js                # Public routes (home has inline handler, not in controller)
    ├── locales/
    │   ├── vi.json               # Vietnamese translations (admin + public + footer keys)
    │   └── en.json               # English translations (admin + public + footer keys)
    ├── utils/slugify.js          # Vietnamese-aware slug generator
    ├── utils/safeFilePath.js     # safeUnlink + safeResolve — chặn path traversal trong file ops
    └── views/
        ├── admin/                # EJS templates (hardcoded Vietnamese)
        │   ├── dashboard.ejs, login.ejs
        │   ├── course-list.ejs, course-create.ejs, course-edit.ejs
        │   ├── teacher-list.ejs, teacher-create.ejs, teacher-edit.ejs
        │   ├── testimonial-list.ejs, testimonial-create.ejs, testimonial-edit.ejs
        │   ├── registration-list.ejs, registration-detail.ejs   # view + delete only
        │   ├── post-list.ejs, post-create.ejs, post-edit.ejs
        │   ├── contact-list.ejs, contact-detail.ejs
        │   ├── document-list.ejs, document-create.ejs
        │   ├── gallery.ejs
        │   └── menu-list.ejs, menu-form.ejs
        ├── web/                  # EJS templates (use header/footer partials, i18n enabled)
        │   ├── home.ejs          # Landing page (gồm testimonials section)
        │   ├── courses.ejs       # Danh sách khóa học (from DB)
        │   ├── course-detail.ejs # Chi tiết khóa học (apply/đăng ký modal, sidebar khóa khác)
        │   ├── teachers.ejs      # Danh sách giáo viên
        │   ├── schedule.ejs      # Lịch khai giảng + form đăng ký học
        │   ├── posts.ejs, post-detail.ejs
        │   ├── about.ejs
        │   ├── contact.ejs
        │   ├── gallery.ejs
        │   ├── documents.ejs
        │   ├── menu-page.ejs
        │   └── 404.ejs, error.ejs
        └── partials/             # header.ejs (public), footer.ejs (public), admin-header.ejs, admin-footer.ejs, admin-sidebar.ejs
```

---

## Database Schema

All tables defined in `src/config/db.js` → `initDatabase()` as `CREATE TABLE IF NOT EXISTS`. No migrations. `journal_mode = WAL` is set. **`PRAGMA foreign_keys = ON` MUST be set** so ON DELETE constraints are enforced.

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | id, username, password_hash, role | Admin accounts |
| `courses` | id, title, slug, description, content, level, fee, duration, schedule, thumbnail, status, title_en, description_en, content_en | Khóa học (bilingual) |
| `teachers` | id, name, slug, photo, qualification, experience, bio, sort_order, status, qualification_en, bio_en | Giáo viên (bilingual) |
| `registrations` | id, full_name, email, phone, course_id, message, is_read, created_at | Đăng ký học thử/ghi danh |
| `testimonials` | id, student_name, avatar, content, rating, course_name, content_en, is_visible, sort_order | Cảm nhận học viên (bilingual) |
| `posts` | id, title, slug, excerpt, content, thumbnail, status, title_en, excerpt_en, content_en | Tin tức/blog (bilingual) |
| `documents` | id, title, filename, filepath, description | PDF tài liệu |
| `gallery_images` | id, filename, filepath, alt_text | Thư viện ảnh |
| `contacts` | id, full_name, email, subject, phone, message, is_read | Liên hệ |
| `menus` | id, name_vi, name_en, slug, type, linked_post_id, is_visible, sort_order | Navigation items |
| `menu_posts` | id, menu_id, post_id, sort_order | Junction for post_list menus (UNIQUE menu_id+post_id) |

> `registrations.course_id` → FK `REFERENCES courses(id) ON DELETE SET NULL`. Cần `PRAGMA foreign_keys = ON` để thực sự enforce.

### Menu Types

| Type | Behavior | URL |
|------|----------|-----|
| `system` | Fixed pages (cannot delete/change type/slug) | Uses slug directly |
| `single_post` | Links to one post | `/posts/:slug` |
| `post_list` | Dropdown menu | `#` (hover for children via `menu_posts`) |
| `custom` | External link | Custom URL |

### Seed Data (auto-created on first run)

- Default admin: `admin` / `admin123` (or from env `ADMIN_USERNAME`/`ADMIN_PASSWORD`)
- 8 system menus: Trang chủ (`/`), Giới thiệu (`/about`), Khóa học (`/khoa-hoc`), Giáo viên (`/giao-vien`), Lịch khai giảng (`/lich-khai-giang`), Tin tức (`/posts`), Thư viện (`/gallery`), Liên hệ (`/contact`)
- (Tùy chọn) seed một vài khóa học / giáo viên / testimonial mẫu

---

## Feature → File Mapping

| Feature | Model | Controller | Public Routes | Admin Routes |
|---------|-------|------------|---------------|--------------|
| Courses | courseModel | courseController | `GET /khoa-hoc`, `GET /khoa-hoc/:slug` | Full CRUD `/admin/courses/*` |
| Teachers | teacherModel | teacherController | `GET /giao-vien` | Full CRUD `/admin/teachers/*` |
| Registration | registrationModel | registrationController | `GET /lich-khai-giang`, `POST /dang-ky` (nhận thêm field tùy chọn `redirect_to`, whitelist `/lich-khai-giang` hoặc `/#registerTest`, để form đăng ký trên trang chủ quay lại đúng vị trí) | View + delete `/admin/registrations/*` |
| Testimonials | testimonialModel | testimonialController | (hiển thị ở `home.ejs`) | Full CRUD `/admin/testimonials/*` |
| Posts/News | postModel | postController | `GET /posts`, `GET /posts/:slug` | Full CRUD `/admin/posts/*` |
| Gallery | galleryModel | galleryController | `GET /gallery` | Upload + delete only `/admin/gallery/*` |
| Documents | documentModel | documentController | `GET /documents`, `GET /documents/:id/download` | Create + delete only `/admin/documents/*` |
| Contact | contactModel | contactController | `GET /contact`, `POST /contact` | View + delete `/admin/contacts/*` |
| Menus | menuModel, menuPostModel | menuController | `GET /menu/:slug` | Full CRUD + reorder + toggle `/admin/menus/*` |
| Auth | userModel | authController | — | `GET/POST /admin/login`, `POST /admin/logout` |
| i18n | — | — | `GET /lang/:lang` | — |
| Home | (inline in web.js) | — | `GET /` (hero + phương pháp luyện thi [static] + 5 khóa học mới nhất + giáo viên + thành tựu học viên [static, hardcode] + testimonials + tin tức + form đăng ký test) | — |
| About | (inline in web.js) | — | `GET /about` (static page, bilingual) | — |

> **Note:** `/about`, `/khoa-hoc`, `/giao-vien`, `/lich-khai-giang` là `system` menus trong DB — render qua `visibleMenus` trong `partials/header.ejs`. Admin chỉnh visibility/order tại `/admin/menus`.

---

## Critical Conventions

### Database (better-sqlite3 is SYNCHRONOUS)

- Models call `.get()`, `.all()`, `.run()` directly — **never `await`** them.
- Models are exported as **plain objects** (not classes).
- Always import via `require('../config/db')` — never create new connections.
- Schema changes go in `src/config/db.js` → `initDatabase()`.
- **`PRAGMA foreign_keys = ON`** phải được bật trong `db.js` ngay sau khi mở connection.

```javascript
// CORRECT
const { db } = require('../config/db');
const Model = {
  getAll() { return db.prepare('SELECT * FROM table').all(); },
  findById(id) { return db.prepare('SELECT * FROM table WHERE id = ?').get(id); },
  create(data) { return db.prepare('INSERT INTO table (name) VALUES (?)').run(data.name); },
  delete(id) { return db.prepare('DELETE FROM table WHERE id = ?').run(id); }
};
module.exports = Model;
```

### Controllers

- Single file with **public + admin** handlers. Admin methods prefixed `admin*`.
- CRUD: `store` (create), `update` (edit), `destroy` (delete).
- Always check `req.uploadError` first for file upload routes.

```javascript
const Controller = {
  index(req, res) {                                      // public list
    res.render('web/courses', { title: 'Khóa học', courses: Model.getPublished() });
  },
  store(req, res) {                                      // admin create
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/courses/create');
    }
    const { title } = req.body;
    if (!title?.trim()) {
      req.session.error = 'Tiêu đề không được để trống';
      return res.redirect('/admin/courses/create');
    }
    const slug = makeUniqueSlug(slugify(title), (s) => Model.slugExists(s));
    const thumbnail = req.file ? '/uploads/images/' + req.file.filename : null;
    try {
      Model.create({ title: title.trim(), slug, thumbnail, status: req.body.status || 'draft' });
      req.session.success = 'Tạo thành công';
      return res.redirect('/admin/courses');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/courses/create');
    }
  },
  destroy(req, res) {                                    // admin delete
    const item = Model.findById(req.params.id);
    if (!item) { req.session.error = 'Không tìm thấy'; return res.redirect('/admin/courses'); }
    safeUnlink(item.thumbnail);
    Model.delete(req.params.id);
    req.session.success = 'Đã xóa';
    return res.redirect('/admin/courses');
  }
};
```

### Auth

- **Session-based** (`express-session`, 24h expiry). Do NOT change to JWT.
- Protected by `requireAuth` middleware in `src/routes/admin.js`.
- Password hashing: `bcrypt` with salt rounds 10, `compareSync` for verification.

### Flash Messages

```javascript
req.session.success = 'Message';  // or req.session.error
return res.redirect('/path');
// Cleared by middleware in app.js, available as res.locals.success / res.locals.error
```

### File Uploads (Multer)

- `uploadImage` — single, field `thumbnail`, 5MB, jpg/png/webp → `public/uploads/images/`
  (dùng cho course thumbnail, teacher photo, testimonial avatar)
- `uploadGallery` — multiple, field `images`, max 20 files, 5MB each → `public/uploads/images/`
- `uploadPdf` — single, field `file`, 20MB → `public/uploads/pdfs/`
- On update/delete: **remove old file from disk** (`safeUnlink`).
- Errors are caught by `handleUploadError` wrapper → sets `req.uploadError` for controllers.

### Slugs

```javascript
const { slugify, makeUniqueSlug } = require('../utils/slugify');
const slug = makeUniqueSlug(slugify(title), (s) => Model.slugExists(s, excludeId));
```

### i18n / Bilingual Content

- DB tables carry `field` + `field_en` columns.
- Views: `lang === 'en' && row.field_en ? row.field_en : row.field`
- `languageMiddleware` exposes `lang`, `t`, `__()` on `res.locals`.
- Add new UI strings to **both** `src/locales/vi.json` and `src/locales/en.json`.

### Available in Views (res.locals)

```
user, success, error, lang, t, __(), visibleMenus, csrfToken
```

### Bảng màu Public vs Admin

`base.css` định nghĩa `:root` (--color-navy, --color-gold, ...) và được load bởi **cả** admin (`admin-header.ejs`, `login.ejs`) và public (`header.ejs`) — đây là bảng màu mặc định/admin (navy `#0d2c54` + gold `#d4af37`), **không sửa trực tiếp** nếu chỉ muốn đổi giao diện public.

Các trang public (mọi `web/*.ejs`) load thêm `header.css` và `footer.css` sau `base.css`. `header.css` re-declare cùng tên custom property trong một block `:root` riêng để **override màu chỉ cho public pages** mà không ảnh hưởng admin:

```css
/* public/css/header.css */
:root {
  --color-navy: #2A2774;   /* tím — thương hiệu public hiện tại */
  --color-gold: #FFC845;   /* vàng */
  --color-pink: #F06292;   /* hồng — biến mới, chỉ dùng ở public */
  ...
}
```

Mọi class có sẵn dùng `var(--color-navy)`/`var(--color-gold)` trong `base.css` (`.btn-navy`, `.btn-gold`, `.card-custom`, `.badge-gold`, `h1-h6`, `.placeholder-img`...) tự động đổi màu trên public mà không cần sửa lại. Class mới `.btn-pink`/`.text-pink`/`.bg-pink` cũng đặt trong `header.css` vì chỉ public dùng. Nếu cần đổi màu admin, sửa `:root` trong `base.css`; nếu cần đổi màu public, sửa block override trong `header.css`.

### Page CSS Override (trang không có hero banner)

Các trang không có banner cần override header về solid:

```css
.site-header { position: relative !important; background: #ffffff !important; }
.nav-menu li a { color: #333333 !important; text-shadow: none !important; }
.header-language span, .dropdown-icon { color: #333333 !important; }
```

### Admin Sidebar `activePage` Keys

| activePage value | URL | Label |
|-----------------|-----|-------|
| `dashboard` | `/admin` | 📊 Dashboard |
| `courses` | `/admin/courses` | 📚 Khóa học |
| `teachers` | `/admin/teachers` | 👩‍🏫 Giáo viên |
| `registrations` | `/admin/registrations` | 📝 Đăng ký học |
| `testimonials` | `/admin/testimonials` | 💬 Cảm nhận |
| `posts` | `/admin/posts` | 📰 Tin tức |
| `documents` | `/admin/documents` | 📄 Tài liệu |
| `gallery` | `/admin/gallery` | 🖼️ Thư viện ảnh |
| `contacts` | `/admin/contacts` | 📬 Liên hệ |
| `menus` | `/admin/menus` | 📋 Quản lý Menu |

Pass via `<% const activePage = 'courses'; %>` ở đầu mỗi admin view.

---

## Known Issues & TODOs

Project mới — bắt đầu sạch. Một số điểm cần chú ý từ đầu (đã rút kinh nghiệm từ mini-cms):

| # | Note |
|---|------|
| 1 | **Bật `PRAGMA foreign_keys = ON`** ngay trong `db.js` để ON DELETE SET NULL/CASCADE được enforce (đặc biệt `registrations.course_id`). |
| 2 | Khi `Model.update()` thay file: xóa file cũ **sau** khi DB write thành công để tránh broken reference khi DB lỗi. |
| 3 | Wire `registrationModel.countUnread()` + `contactModel.countUnread()` vào dashboard. |
| 4 | Dùng locale keys cho `404.ejs`, `error.ejs` và admin views thay vì hardcode (nếu cần đa ngữ admin). |

---

## Database Operations Require User Confirmation

**Before ANY CREATE / UPDATE / DELETE on schema or data**, describe the change and wait for user approval:

```
DATABASE CHANGE REQUEST:
- Action: [CREATE TABLE / ALTER / INSERT / DELETE]
- SQL: [exact SQL]
- Impact: [what changes]
- Files affected: [which files]
Proceed? (yes/no)
```

This applies to schema edits in `db.js` and destructive data operations. Do NOT run unprompted.

---

## Self-Maintenance: Keep CLAUDE.md in Sync

**After completing any task** that changes the codebase structure, Claude Code MUST update this `CLAUDE.md` file to reflect the changes. This ensures CLAUDE.md remains the single source of truth.

### When to update

| Trigger | What to update in CLAUDE.md |
|---------|----------------------------|
| New/renamed model, controller, middleware, route file | Folder Structure, Feature → File Mapping |
| New/altered/dropped DB table or column | Database Schema table |
| New menu type | Menu Types table |
| New feature (full CRUD or public page) | Feature → File Mapping, Folder Structure |
| New upload type or changed limits | File Uploads section |
| New middleware added to chain | Middleware Order, Folder Structure |
| New route group mounted in `app.js` | Route Mounting Order |
| New `res.locals` variable exposed globally | Available in Views section |
| New locale keys pattern or i18n behavior change | i18n section |
| New util file | Folder Structure |
| Bug fix or feature completion from Known Issues | Known Issues & TODOs section |

### How to update

1. After finishing the code task, review which sections of CLAUDE.md are affected.
2. Edit **only** the affected sections — keep the rest untouched.
3. Do NOT ask for permission to update CLAUDE.md — this is a **standing instruction**.

---

## MUST Do

- Dùng `.get()`, `.all()`, `.run()` của better-sqlite3 — **không bao giờ `await`**
- Bật `PRAGMA foreign_keys = ON` trong `db.js`
- Export model là plain object, không phải class
- Prefix method admin bằng `admin*` trong controller
- Kiểm tra `req.uploadError` trước mọi xử lý trong route có upload
- Flash message bằng `req.session.success/error` + redirect (không render trực tiếp)
- Thêm translation vào **cả** `vi.json` và `en.json`
- Dùng `field` + `field_en` cho nội dung song ngữ trong DB
- Schema mới → `src/config/db.js → initDatabase()`
- System page mới → thêm insert-if-not-exists menu trong `initDatabase()`
- Sau mỗi thay đổi cấu trúc → cập nhật `CLAUDE.md`

## MUST NOT

- Dùng `async/await` cho database operations
- Thêm frontend framework (React, Vue, etc.)
- Đổi session auth sang JWT
- Thay đổi thứ tự middleware chain trong `app.js`
- Dùng ORM ngoài (Sequelize, TypeORM, etc.)
- Tạo database connection mới (luôn dùng `require('../config/db')`)
