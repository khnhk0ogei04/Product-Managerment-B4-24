const { prefixAdmin } = require('../../config/system');
const ProductCategory = require('../../models/product-category.model');
const createTreeHelper = require('../../helpers/createTree.helper');
const systemConfig = require('../../config/system');
const { countDocuments } = require('../../models/product.model');
// [GET] /admin222/products-category
module.exports.index = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false
    }).sort({position: "asc"})
    console.log(records);
    res.render("admin/pages/products-category/index", {
        pageTitle: "Category List",
        records: records
    })
}
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted: false
    })
    const newCategories = createTreeHelper(categories);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Add new category list",
        categories: newCategories
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
// [GET] admin222/products-category/edit/:id
module.exports.edit = async(req, res) => {
    const id = req.params.id;
    const category = await ProductCategory.findOne({
        _id: id,
        deleted: false
    })
    const categories = await ProductCategory.find({
        deleted: false
    })
    console.log(category);
    const newCategories = createTreeHelper(categories);
    res.render("admin/pages/products-category/edit", {
        pageTitle: "Edit products",
        categories: newCategories,
        category: category
    })
}
// [PATCH] /admin222/products-category/create:
module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    if (req.body.position){
        req.body.position = parseInt(req.body.postion);
    } else {
        const countCategory = await ProductCategory.countDocuments({});
        req.body.position = countCategory + 1;
    }
    await ProductCategory.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash('success', 'Update successfully');
    res.redirect('back');
}
// [PATCH] /admin222/products-category/edit/:id
module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    if (req.body.position){
        req.body.position = parseInt(req.body.position);
    } else {
        const countCategory = await ProductCategory.countDocuments({});
        req.body.position = countCategory + 1;
    }
    await ProductCategory.updateOne({
        _id : id,
        deleted: false
    }, req.body);
    req.flash('success', 'Update successfully');
    res.redirect('back');
}