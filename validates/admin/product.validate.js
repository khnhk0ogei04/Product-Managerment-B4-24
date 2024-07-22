module.exports.createPost = async (req, res, next) => {
    if (!req.body.title){
        req.flash("Error", "Title can not be blanked");
        res.redirect("back");
        return;
    }
    next();
}
