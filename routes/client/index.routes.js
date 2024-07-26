const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const userRoute = require("./user.route");
module.exports.index = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use("/", homeRoute);
    app.use("/cart", cartRoute);
    app.use("/products", categoryMiddleware.category, productRoute);
    app.use("/search", searchRoute);
    app.use("/checkout", checkoutRoute);
    app.use("/user", userRoute);
}