const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
// [GET] products/
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

// [GET] products/:slugCategory
module.exports.category = async(req, res) => {
    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
        slug: slugCategory,
        status: "active",
        deleted: false
    })
    console.log(category);
    const allSubCategory = [];
    const getSubcategory = async (currentId) => {
        const subCategory = await ProductCategory.find({
            parentId: currentId,
            status: "active",
            deleted: false
        });
        for (const sub of subCategory){
            allSubCategory.push(sub.id);
            await getSubcategory(sub.id);
        }
    }
    await getSubcategory(category._id);
    console.log(allSubCategory);
    const products = await Product.find({
        product_category_id: {$in: [category.id, ...allSubCategory]},
        // $in: Tim cac san pham co productCategoryId giong voi 1 trong so cac phan tu o trong mang nay
        status: "active",
        deleted: false
    })
    .sort({
        position: "desc"
    });
    for (const item of products){
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }
    res.render("client/pages/products/index", {
        pageTitle: "Danh Sach San Pham",
        products: products
    });
}

// [GET] products/detail/:slug
module.exports.detail = async(req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });
    console.log(product);
    product.priceNew = ((1 - product.discountPercentage/100) * product.price).toFixed(0);
    if(product){
        res.render("client/pages/products/detail", {
            pageTitle: "Product Detail",
            product: product
        })
    } else {
        res.redirect("/");
    }
}