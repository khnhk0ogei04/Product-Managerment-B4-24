const createTreeHelper = require("../../helpers/createTree.helper");
const ProductCategory = require("../../models/product-category.model");

// [GET]
module.exports.index = (req, res) => {
    res.render("client/pages/home/index", {
        pageTitle: "Trang Chủ",
    });
};