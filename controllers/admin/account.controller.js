const md5 = require('md5');
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const { generateRandomString } = require('../../helpers/generate.helper');
const systemConfig = require("../../config/system");
// [GET] admin222/accounts/
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false
    })
    for (const record of records){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.roleTitle = role.title;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Admin Account",
        records: records,
        
    })
}
// [GET] admin222/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    }).select("title");
    res.render("admin/pages/accounts/create", {
        pageTitle: "Create new account",
        roles: roles
    })
}
// [POST] admin222/accounts/create
module.exports.createPost = async(req, res) => {
    req.body.password = md5(req.body.password);
    req.body.token = generateRandomString(30);
    console.log(req.body);
    const account = new Account(req.body);
    await account.save();
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}
// [GET] admin222/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne({
            _id: id,
            deleted: false
        })
        console.log(account);
        const roles = await Role.find({
            deleted: false
        }).select("title");
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Edit account",
            roles: roles,
            account: account
        })
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}
// PATCH /admin222/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    if (req.body.password){
        delete(req.body.password);
    } else {
        req.body.password = md5(req.body.password);
    }
    await Account.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash("success", "Update successfully");
    res.redirect('back');
}