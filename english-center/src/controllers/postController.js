const PostModel = require('../models/postModel');
const { slugify, makeUniqueSlug } = require('../utils/slugify');
const { safeUnlink } = require('../utils/safeFilePath');

const PostController = {
  index(req, res) {
    res.render('web/posts', { title: 'Tin tức', posts: PostModel.getPublished() });
  },
  show(req, res) {
    const post = PostModel.findBySlug(req.params.slug);
    if (!post || post.status !== 'published') {
      return res.status(404).render('web/404', { title: 'Không tìm thấy' });
    }
    res.render('web/post-detail', { title: post.title, post });
  },

  adminIndex(req, res) {
    res.render('admin/post-list', { activePage: 'posts', title: 'Tin tức', posts: PostModel.getAll() });
  },
  adminCreateForm(req, res) {
    res.render('admin/post-create', { activePage: 'posts', title: 'Thêm bài viết' });
  },
  store(req, res) {
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect('/admin/posts/create');
    }
    const { title, excerpt, content, status, title_en, excerpt_en, content_en } = req.body;
    if (!title?.trim()) {
      req.session.error = 'Tiêu đề không được để trống';
      return res.redirect('/admin/posts/create');
    }
    const slug = makeUniqueSlug(slugify(title), (s) => PostModel.slugExists(s));
    const thumbnail = req.file ? '/uploads/images/' + req.file.filename : null;
    try {
      PostModel.create({
        title: title.trim(), slug, excerpt: excerpt || null, content: content || null,
        thumbnail, status: status || 'draft',
        title_en: title_en || null, excerpt_en: excerpt_en || null, content_en: content_en || null,
      });
      req.session.success = 'Tạo bài viết thành công';
      return res.redirect('/admin/posts');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/posts/create');
    }
  },
  adminEditForm(req, res) {
    const post = PostModel.findById(req.params.id);
    if (!post) {
      req.session.error = 'Không tìm thấy bài viết';
      return res.redirect('/admin/posts');
    }
    res.render('admin/post-edit', { activePage: 'posts', title: 'Sửa bài viết', post });
  },
  update(req, res) {
    const post = PostModel.findById(req.params.id);
    if (!post) {
      req.session.error = 'Không tìm thấy bài viết';
      return res.redirect('/admin/posts');
    }
    if (req.uploadError) {
      req.session.error = req.uploadError;
      return res.redirect(`/admin/posts/${req.params.id}/edit`);
    }
    const { title, excerpt, content, status, title_en, excerpt_en, content_en } = req.body;
    if (!title?.trim()) {
      req.session.error = 'Tiêu đề không được để trống';
      return res.redirect(`/admin/posts/${req.params.id}/edit`);
    }
    const newSlug = slugify(title);
    const slug = post.slug === newSlug ? post.slug : makeUniqueSlug(newSlug, (s) => PostModel.slugExists(s, post.id));
    const thumbnail = req.file ? '/uploads/images/' + req.file.filename : post.thumbnail;
    try {
      PostModel.update(req.params.id, {
        title: title.trim(), slug, excerpt: excerpt || null, content: content || null,
        thumbnail, status: status || 'draft',
        title_en: title_en || null, excerpt_en: excerpt_en || null, content_en: content_en || null,
      });
      if (req.file && post.thumbnail) safeUnlink(post.thumbnail);
      req.session.success = 'Cập nhật thành công';
      return res.redirect('/admin/posts');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect(`/admin/posts/${req.params.id}/edit`);
    }
  },
  destroy(req, res) {
    const post = PostModel.findById(req.params.id);
    if (!post) {
      req.session.error = 'Không tìm thấy bài viết';
      return res.redirect('/admin/posts');
    }
    safeUnlink(post.thumbnail);
    PostModel.delete(req.params.id);
    req.session.success = 'Đã xóa bài viết';
    return res.redirect('/admin/posts');
  },
};

module.exports = PostController;
