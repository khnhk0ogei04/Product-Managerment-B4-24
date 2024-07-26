const md5 = require('md5');
const generateHelper = require("../../helpers/generate.helper");
const User = require("../../models/user.model");
const ForgotPassword = require('../../models/forgot-password.model');
// [GET] /user/register
module.exports.register = async(req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký sản phẩm"
    })
}
// [POST] /user/register
module.exports.registerPost = async(req, res) => {
    const existUser = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existUser){
        req.flash('error', 'Email already existed');
        res.redirect('back');
        return;
    }
    const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        tokenUser: generateHelper.generateRandomString(30)
    };
    console.log(userData);
    const user = new User(userData);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    req.flash('success', 'Register successfully');
    res.redirect('back');
}
// [GET] /user/login
module.exports.login = async(req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Login Account"
    })
}
// [POST] /user/login
module.exports.loginPost = async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!user){
        req.flash("Error", "Email is not existed");
        res.redirect("back");
        return;
    }
    if (md5(req.body.password) != user.password){
        req.flash("Error", "Password is incorrect");
        res.redirect("back");
        return;
    }
    if (user.status != "active"){
        req.flash("error", "This account has been blocked");
        res.redirect('back');
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    req.flash('success', "Login successfully");
    res.redirect("/");
}
// [GET] /user/logout
module.exports.logout = async(req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
}
// [GET] /password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    })
}
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async(req, res) => {
    const email = req.body.email;
    // console.log(email);
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!email){
        req.flash("error", "Email khong ton tai trong he thong");
        res.redirect("back");
        return; // Can bo sung them mixins alert ben FE
    }
    // Step 2: Save email, OTP to database:
    const otp = generateHelper.generateRandomNumber(6)
    const forgotPasswordData = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 3*60*1000
    }
    const forgotPassword = new ForgotPassword(forgotPasswordData);
    await forgotPassword.save();
    // Step 1: Send OTP to email of user:

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword =  async(req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác thực OTP",
        email: email
    })
};

// [POST] /user/password/otp
module.exports.otpPasswordPost =  async(req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!result){
        req.flash('error', "OTP is not valid");
        res.redirect('back');
        return;
    }
    const user = await User.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    console.log(result);
    res.redirect("/user/password/reset");
};
// [GET] /user/password/reset
module.exports.resetPassword = async(req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Reset Password"
    });
};
// [PATCH] /user/password/reset
module.exports.resetPasswordPatch = async(req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser,
        deleted: false
    }, {
        password: md5(password)
    });
    res.redirect("/");
};