const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
const Cart = require("../../models/cart.model");
module.exports.cartId = async(req, res, next) => {
    console.log(req.cookies.cartId);
    if (!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();
        const expires = 365*24*60*60*1000; // Don vi ms
        // Luu them thoi gian het han: 
        res.cookie("cartId", 
            cart.id,
            {
                expires: new Date(Date.now() + expires)
            });
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
        res.locals.cartTotal = cart.products.length || 0; 
    }
    next();
}