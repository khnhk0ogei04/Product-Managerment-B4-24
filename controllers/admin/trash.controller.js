const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
const { model } = require('mongoose');

module.exports.index = async (req, res) => {
    const find = {
        deleted: true
    }
    const products = await Product.find(find)
    for (const item of products){
        if(item.deletedBy){
            const accountDelete = await Account.findOne({
                _id: item.deletedBy
            })
            item.deletedByFullName = accountDelete.fullName;
        } else {
            item.deletedByFullName = "";
        }
    }
    res.render("admin/pages/trash/index", {
        pageTitle: "Thùng rác",
        products: products
    });
}
module.exports.restore = async(req, res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        deleted: false
    });
    res.json({
        code: 200
    });
}
