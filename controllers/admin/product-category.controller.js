const { prefixAdmin } = require('../../config/system');
const ProductCategory = require('../../models/product-category.model');
// [GET] /admin/products-category
module.exports.index = (req, res) => {
    res.render("admin/pages/products-category/index", {
        pageTitle: "Category List"
    })
}
module.exports.create = (req, res) => {
    res.render("admin/pages/products-category/create", {
        pageTitle: "Add new category list"
    })
}
module.exports.createPost = async (req, res) => {
    console.log(req.body);
    // Sau khi tao model, viet cau lenh luu vao database
    if (req.body.position){
        req.body.position = parseInt(req.body.position);
    } else {
        const countProductsCategory = await ProductCategory.countDocuments({});
        req.body.position = countProductsCategory + 1;
    }
    const newCategory = new ProductCategory(req.body);
    await newCategory.save();
    res.redirect(`/${prefixAdmin}/products-category`);
}