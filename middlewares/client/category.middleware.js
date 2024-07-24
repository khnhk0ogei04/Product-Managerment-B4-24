const createTreeHelper = require("../../helpers/createTree.helper");
const ProductCategory = require("../../models/product-category.model");

module.exports.category = async (req, res, next) => {
    const categoryProducts = await ProductCategory.find({
        deleted: false,
        status: "active"
    })
    const newCategoryProducts = createTreeHelper(categoryProducts);
    res.locals.layoutCategoryProducts = newCategoryProducts;
    // Bat ki trang nao chay qua middleware nay thi deu lay ra danh muc
    // Khi tao res.locals.account thi ap dung cho tat ca cac ham o phia sau, ap dung cho ca giao dien view cho ca ham sau do render ra giao dien view day
    next();
}