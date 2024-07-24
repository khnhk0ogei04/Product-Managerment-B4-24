const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    const account = await Account.findOne({
        token: req.cookies.token,
        deleted: false
    }).select("fullName email phone avatar role_id status");
    if(!account){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    const role = await Role.findOne({
        _id: account.role_id
    }).select("title permissions")
    console.log(role);
    res.locals.account = account;
    res.locals.role = role;
    // Khi tao res.locals.account thi ap dung cho tat ca cac ham o phia sau, ap dung cho ca giao dien view cho ca ham sau do render ra giao dien view day
    next();
}