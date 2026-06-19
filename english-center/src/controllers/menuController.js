const MenuModel = require('../models/menuModel');
const MenuPostModel = require('../models/menuPostModel');
const PostModel = require('../models/postModel');
const { slugify, makeUniqueSlug } = require('../utils/slugify');

const MenuController = {
  show(req, res) {
    const menu = MenuModel.findBySlug(req.params.slug);
    if (!menu || !menu.is_visible) {
      return res.status(404).render('web/404', { title: 'Không tìm thấy' });
    }
    if (menu.type === 'single_post' && menu.linked_post_id) {
      const post = PostModel.findById(menu.linked_post_id);
      if (post) return res.redirect(`/posts/${post.slug}`);
      return res.status(404).render('web/404', { title: 'Không tìm thấy' });
    }
    if (menu.type === 'custom' && menu.url) {
      return res.redirect(menu.url);
    }
    const posts = MenuPostModel.getPostsByMenuId(menu.id);
    res.render('web/menu-page', { title: menu.name_vi, menu, posts });
  },

  adminIndex(req, res) {
    res.render('admin/menu-list', { activePage: 'menus', title: 'Quản lý Menu', menus: MenuModel.getAll() });
  },
  adminCreateForm(req, res) {
    res.render('admin/menu-form', {
      activePage: 'menus', title: 'Thêm menu', menu: null,
      posts: PostModel.getPublished(), selectedPostIds: [],
    });
  },
  store(req, res) {
    const { name_vi, name_en, slug, type, linked_post_id, url, is_visible } = req.body;
    if (!name_vi?.trim()) {
      req.session.error = 'Tên menu không được để trống';
      return res.redirect('/admin/menus/create');
    }
    const finalSlug = makeUniqueSlug(slugify(slug || name_vi), (s) => MenuModel.slugExists(s));
    try {
      const result = MenuModel.create({
        name_vi: name_vi.trim(), name_en: name_en || null, slug: finalSlug,
        type: type || 'custom', linked_post_id: linked_post_id ? Number(linked_post_id) : null,
        url: url || null, is_visible: is_visible ? 1 : 0, sort_order: MenuModel.getNextSortOrder(),
      });
      if (type === 'post_list' && req.body.post_ids) {
        const postIds = Array.isArray(req.body.post_ids) ? req.body.post_ids.map(Number) : [Number(req.body.post_ids)];
        MenuPostModel.assignPostsToMenu(result.lastInsertRowid, postIds);
      }
      req.session.success = 'Tạo menu thành công';
      return res.redirect('/admin/menus');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect('/admin/menus/create');
    }
  },
  adminEditForm(req, res) {
    const menu = MenuModel.findById(req.params.id);
    if (!menu) {
      req.session.error = 'Không tìm thấy menu';
      return res.redirect('/admin/menus');
    }
    res.render('admin/menu-form', {
      activePage: 'menus', title: 'Sửa menu', menu,
      posts: PostModel.getPublished(), selectedPostIds: MenuPostModel.getPostIdsByMenuId(menu.id),
    });
  },
  update(req, res) {
    const menu = MenuModel.findById(req.params.id);
    if (!menu) {
      req.session.error = 'Không tìm thấy menu';
      return res.redirect('/admin/menus');
    }
    const { name_vi, name_en, slug, type, linked_post_id, url, is_visible } = req.body;
    if (!name_vi?.trim()) {
      req.session.error = 'Tên menu không được để trống';
      return res.redirect(`/admin/menus/${req.params.id}/edit`);
    }
    if (menu.type === 'system' && (type !== menu.type || slugify(slug || name_vi) !== menu.slug)) {
      req.session.error = 'Không thể thay đổi loại hoặc slug của menu hệ thống';
      return res.redirect(`/admin/menus/${req.params.id}/edit`);
    }
    const finalType = menu.type === 'system' ? 'system' : (type || 'custom');
    const finalSlug = menu.type === 'system' ? menu.slug : makeUniqueSlug(slugify(slug || name_vi), (s) => MenuModel.slugExists(s, menu.id));
    try {
      MenuModel.update(req.params.id, {
        name_vi: name_vi.trim(), name_en: name_en || null, slug: finalSlug, type: finalType,
        linked_post_id: linked_post_id ? Number(linked_post_id) : null, url: url || null,
        is_visible: is_visible ? 1 : 0, sort_order: menu.sort_order,
      });
      if (finalType === 'post_list') {
        MenuPostModel.removeAllPostsFromMenu(menu.id);
        if (req.body.post_ids) {
          const postIds = Array.isArray(req.body.post_ids) ? req.body.post_ids.map(Number) : [Number(req.body.post_ids)];
          MenuPostModel.assignPostsToMenu(menu.id, postIds);
        }
      }
      req.session.success = 'Cập nhật thành công';
      return res.redirect('/admin/menus');
    } catch (e) {
      req.session.error = 'Có lỗi xảy ra';
      return res.redirect(`/admin/menus/${req.params.id}/edit`);
    }
  },
  toggleVisibility(req, res) {
    const menu = MenuModel.findById(req.params.id);
    if (!menu) {
      req.session.error = 'Không tìm thấy menu';
      return res.redirect('/admin/menus');
    }
    MenuModel.toggleVisibility(req.params.id);
    req.session.success = 'Đã cập nhật trạng thái hiển thị';
    return res.redirect('/admin/menus');
  },
  moveUp(req, res) {
    const menus = MenuModel.getAll();
    const idx = menus.findIndex((m) => m.id === Number(req.params.id));
    if (idx > 0) {
      const current = menus[idx];
      const prev = menus[idx - 1];
      MenuModel.updateSortOrder(current.id, prev.sort_order);
      MenuModel.updateSortOrder(prev.id, current.sort_order);
    }
    return res.redirect('/admin/menus');
  },
  moveDown(req, res) {
    const menus = MenuModel.getAll();
    const idx = menus.findIndex((m) => m.id === Number(req.params.id));
    if (idx !== -1 && idx < menus.length - 1) {
      const current = menus[idx];
      const next = menus[idx + 1];
      MenuModel.updateSortOrder(current.id, next.sort_order);
      MenuModel.updateSortOrder(next.id, current.sort_order);
    }
    return res.redirect('/admin/menus');
  },
  destroy(req, res) {
    const menu = MenuModel.findById(req.params.id);
    if (!menu) {
      req.session.error = 'Không tìm thấy menu';
      return res.redirect('/admin/menus');
    }
    if (menu.type === 'system') {
      req.session.error = 'Không thể xóa menu hệ thống';
      return res.redirect('/admin/menus');
    }
    MenuModel.delete(req.params.id);
    req.session.success = 'Đã xóa menu';
    return res.redirect('/admin/menus');
  },
};

module.exports = MenuController;
