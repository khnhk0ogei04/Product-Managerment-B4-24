const dashboardRoute = require("./dashboard.route");
const productsRoute = require("./product.route");
const systemConfig = require("../../config/system");
const trashRoute = require("./trash.route");
const rolesRoute = require("./role.route");
const accountRoute = require("./account.router");
const productsCategoryRoute = require("./products-category-route");
const authRoute = require("./auth.route");
const profileRoute = require("./profile.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
module.exports.index = (app) => {
  const path = `/${systemConfig.prefixAdmin}`;
  app.use(
    `${path}/dashboard`,
    authMiddleware.requireAuth, 
    dashboardRoute);
  app.use(`${path}/products`,authMiddleware.requireAuth, productsRoute);
  app.use(`${path}/trash`, authMiddleware.requireAuth,  trashRoute);
  app.use(`${path}/products-category`, authMiddleware.requireAuth,  productsCategoryRoute);
  app.use(`${path}/roles`, authMiddleware.requireAuth,  rolesRoute);
  app.use(`${path}/accounts`, authMiddleware.requireAuth,  accountRoute);
  app.use(`${path}/profile`, authMiddleware.requireAuth, profileRoute);
  app.use(`${path}/auth`, authRoute);
}