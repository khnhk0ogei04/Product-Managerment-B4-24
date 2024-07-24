const Account = require("../../models/account.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");
// [GET] /admin222/auth/login
module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login", {
        pageTitle: "Login account"
    })
}
// [POST] /admin222/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const account = await Account.findOne({
        email: email,
        deleted: false
    });
    if (!account){
        req.flash('error', 'Email is not exist in system');
        res.redirect('back');
        return;
    }
    if(md5(password) != account.password){
        req.flash('error', "Password Error");
        res.redirect('back');
        return;
    }
    if (account.status !== "active"){
        req.flash('error', 'Account is blocked');
        res.redirect('back');
        return;
    }
    res.cookie("token", account.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}
// [GET] /admin222/auth/logout:
module.exports.logout = async(req, res) => {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}