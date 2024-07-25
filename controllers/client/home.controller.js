const createTreeHelper = require("../../helpers/createTree.helper");
const Product = require("../../models/product.model");

// [GET]
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        status: "active",
        deleted: false
    }).sort({position: "desc"}).limit(6).select("-description");
    // Chon ra tat ca cac truong tru truong mo ta
    console.log(productsFeatured);
    const productsNew = await Product.find({
        status: "active",
        deleted: false
    })
    .sort({position: "desc"})
    .limit(6)
    .select("-description");
    for (const item of productsFeatured){
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }
    for (const item of productsNew){
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }
    res.render("client/pages/home/index", {
        pageTitle: "Trang Chủ",
        productsFeatured: productsFeatured,
        productsNew: productsNew
    });
};