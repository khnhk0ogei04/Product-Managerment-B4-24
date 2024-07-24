module.exports.index = (req, res) => {
    res.render("admin/pages/profile/index", {
        pageTitle: "Trang Thông Tin Cá Nhân"
    });
};