const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
// [GET] /admin222/roles/
module.exports.index = async(req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}
// [GET] /admin222/roles/create 
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo mới nhóm quyền"
    })
}
// [POST] /admin222/roles/create
module.exports.createPost = async(req, res) => {
    console.log(req.body);
    const record = new Role(req.body);
    await record.save();
    req.flash('success', 'Successfully create new role');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}
// [GET] /admin222/roles/edit/:id
module.exports.edit = async(req, res) => {
    try {
        const id = req.params.id;
        const record = await Role.findOne({
            _id: id,
            deleted: false
        });
        console.log(record);
        res.render(`admin/pages/roles/edit`, {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}
// [PATCH] /admin222/roles/patch/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await Role.updateOne({
            _id: id,
            deleted: false
        }, data);
        req.flash("success", "Update successfully");
        res.redirect('back');
    } catch (error) {
        req.flash('error', 'Update failed');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}
// [GET] admin222/roles/permissions
module.exports.permissions = async(req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}
// [PATCH] admin222/roles/permissions
module.exports.permissionsPatch = async(req, res) => {
    const roles = req.body;
    for (const role of roles) {
        await Role.updateOne({
            _id: role.id,
            deleted: false 
        }, {
            permissions: role.permissions // Cap nhat quyen cua nguoi su dung
        });
    }
    req.flash('success', 'Update successfully');
}