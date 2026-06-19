const menuModel = require('../models/menuModel');
const menuPostModel = require('../models/menuPostModel');
const postModel = require('../models/postModel');

function menuMiddleware(req, res, next) {
  res.locals.visibleMenus = menuModel.getVisible().map((menu) => {
    if (menu.type === 'post_list') {
      return { ...menu, children: menuPostModel.getPostsByMenuId(menu.id) };
    }
    if (menu.type === 'single_post' && menu.linked_post_id) {
      const post = postModel.findById(menu.linked_post_id);
      return { ...menu, url: post ? `/posts/${post.slug}` : '#' };
    }
    return menu;
  });
  next();
}

module.exports = menuMiddleware;
