const dashboardRoute = require("./dashboard.route");
const productsRoute = require("./product.route");
const systemConfig = require("../../config/system");
const trashRoute = require("./trash.route");
const rolesRoute = require("./role.route");
const accountRoute = require("./account.router");
const productsCategoryRoute = require("./products-category-route");
const authRoute = require("./auth.route");
module.exports.index = (app) => {
  const path = `/${systemConfig.prefixAdmin}`;
  app.use(`${path}/dashboard`, dashboardRoute);
  app.use(`${path}/products`, productsRoute);
  app.use(`${path}/trash`, trashRoute);
  app.use(`${path}/products-category`, productsCategoryRoute);
  app.use(`${path}/roles`, rolesRoute);
  app.use(`${path}/accounts`, accountRoute);
  app.use(`${path}/auth`, authRoute);
}