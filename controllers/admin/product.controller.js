const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");
const { model } = require("mongoose");
const { prefixAdmin } = require("../../config/system");
const system = require("../../config/system");
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
    const products = await Product.find(find)
                        .limit(pagination.limitItems)
                        .skip(pagination.skip)
                        .sort({
                            position: "desc"
                        });

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
        deleted: true
    });
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
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    })
}
// [POST] /admin222/products/create
module.exports.createPost = async(req, res) => {
    console.log(req.file);
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
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/${prefixAdmin}/products`);
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
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit products",
            product: product
        })
    } catch (error) {
        res.redirect(`/${prefixAdmin}/products`);
    }
}
// [PATCH] /admin222/products/edit/:id
module.exports.editPatch = async(req, res) => {
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
        await Product.updateOne({
            _id : id,
        }, req.body);
        req.flash("success", "Update successully");
    } catch (error) {
        req.flash("error", "Updated failed");
    }
    res.redirect("back");
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