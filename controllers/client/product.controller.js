const Product = require("../../models/product.model");

module.exports.index = async(req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
    .sort({
        position: "desc"
    });
    for (const item of products){
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }
    console.log(products);
    res.render("client/pages/products/index", {
        pageTitle: "Danh Sach San Pham",
        products: products
    });
}
// [GET] products/:slug
module.exports.detail = async(req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });
    console.log(product);
    if(product){
        res.render("client/pages/products/detail", {
            pageTitle: "Product Detail",
            product: product
        })
    } else {
        res.redirect("/");
    }
}
