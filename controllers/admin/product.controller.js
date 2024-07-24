const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");
const { model } = require("mongoose");
const { prefixAdmin } = require("../../config/system");
const system = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
const Account = require("../../models/account.model");
const moment = require('moment');
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    const filterStatus = [
        {
            label: "Tất cả",
            status: ""
        },
        {
            label: "Hoạt động",
            status: "active"
        },
        {
            label: "Dừng Hoạt động",
            status: "inactive"
        }
    ];
    if (req.query.status){
        find.status = req.query.status;
    }
    // Tim Kiem //
    let keyword = "";
    if (req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i"); // "i": Khong phan biet chu hoa chu thuong
        find.title = regex;
        // keyword = req.query.keyword;
    }
    // Het Tim Kiem //
    const pagination = await paginationHelper(req);

    // Sap xep
    const sort = {};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    const products = await Product.find(find)
                        .limit(pagination.limitItems)
                        .skip(pagination.skip)
                        .sort(sort);
    for (const item of products){
        if(item.createdBy){
            // console.log(item.createdBy);
            const accountCreated = await Account.findOne({
                _id: item.createdBy
            });
            item.createdByFullName = accountCreated.fullName;
        } else {
            item.createdByFullName = "";
        }
        item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
        // Neu HH thi dinh dang 24h, hh thi dinh dang 12h
        if(item.updatedBy){
            const accountUpdated = await Account.findOne({
                _id: item.updateBy
            });
            item.updatedByFullName = accountUpdated.fullName;
        } else {
            item.updatedByFullName = "No Information";
        }
        item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: pagination
  });
}
module.exports.changeStatus = async(req, res) => {
    // console.log(req.params.id);
    // const id = req.params.id;
    // const statusChange = req.params.statusChange;
    const {id, statusChange} = req.params;
    await Product.updateOne({
        _id: id,
    },{
        status: statusChange
    });
    req.flash('success', 'welcome');
    res.json({
        code: 200
    });
}
// PATCH
module.exports.changeMulti = async (req, res) => {
    console.log(req.body);
    const {status, ids} = req.body;
    switch(status){
        case "active":
        case "inactive":
            await Product.updateMany({
                _id : ids
            }, {
                status: status
            });
        break;
        case "delete":
            await Product.updateMany({
                _id: ids
            }, {
                deleted: true
            })
    }
    res.json({
        code: 200
    });
}
// DELETE
module.exports.deleteItem = async(req, res) => {
        const id = req.params.id;
        await Product.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: res.locals.account.id
        });
        req.flash('success', 'Delete item successfully');
        res.json({
            code: 200
        });
    } 
// PATCH [CHANGE POSITION]
module.exports.changePosition = async(req, res) => {
    const id = req.params.id;
    const position = req.body.position;
    console.log(position);
    await Product.updateOne({
        _id: id
    }, {
        position: position
    });
    res.json({
        code: 200
    })
}
// GET /admin222/products/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted: false
    });
    const newCategories = createTreeHelper(categories);
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        categories: newCategories
    })
}
// [POST] /admin222/products/create
module.exports.createPost = async(req, res) => {
    if(res.locals.role.permissions.includes("products_create")){
        console.log(req.body);
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position){
            req.body.position = parseInt(req.body.position);
        } else {
            const countProducts = await Product.countDocuments({});
            req.body.position = countProducts + 1;
        }
        req.body.createdBy = res.locals.account.id;
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/${prefixAdmin}/products`);
    } else {
        res.send(`403`);
    }
}

// [GET] /admin222/products/edit/:id
module.exports.edit = async(req, res) => {
        try {
            const id = req.params.id;
            const product = await Product.findOne({
                _id: id,
                deleted: false
            });
            console.log(product);
            if(product){
                const categories = await ProductCategory.find({
                    deleted: false
                });
                const newCategories = createTreeHelper(categories);
                res.render("admin/pages/products/edit", {
                    pageTitle: "Edit products",
                    product: product,
                    categories: newCategories
                })
            } else {
                res.redirect(`/${prefixAdmin}/products`);
            } 
        } catch (error) {
                res.redirect(`/${prefixAdmin}/products`);
    }
}
// [PATCH] /admin222/products/edit/:id
module.exports.editPatch = async(req, res) => {
    if(res.local.role.permissions.includes("products_edit")){
        try{
            const id = req.params.id;
            console.log(id);
            if (req.file && req.file.filename){
                req.body.thumbnail = `/uploads/${req.file.filename}`;
            }
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            if (req.body.position){
                req.body.position = parseInt(req.body.position);
            } else {
                const countProducts = await Product.countDocuments({});
                req.body.position = countProducts + 1;
            }
            req.body.updatedBy = res.locals.account.id;
            await Product.updateOne({
                _id : id,
            }, req.body);
            req.flash("success", "Update successully");
        } catch (error) {
            req.flash("error", "Updated failed");
        }
        res.redirect("back");
    } else {
        res.send(`403`);
    }
}

// [GET] /admin222/products/detail/:id
module.exports.detail = async(req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        console.log(product);
        if (product){
            res.render("admin/pages/products/detail", {
                pageTitle: "Product Detail",
                product: product
            })
        } else {
            res.redirect(`/${prefixAdmin}/products`);
        }
    } catch (error) {
        res.redirect(`/${prefixAdmin}/products`);
    }
}