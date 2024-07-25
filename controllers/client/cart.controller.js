const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
// [GET] 
module.exports.index = async(req, res) => {
    const cartId = req.cookies.cartId;
    let cart = [];
    cart = await Cart.findOne({
            _id: cartId
        });
        cart.totalPrice = 0;
    try{
        if(cart.products.length > 0){
            for (const product of cart.products){
                const productInfo = await Product.findOne({
                    _id: product.productId
                }).select("title thumbnail price discountPercentage slug");
                productInfo.priceNew = (1 - productInfo.discountPercentage / 100)*productInfo.price;
                product.productInfo = productInfo;
                // product.totalPrice = productInfo.priceNew * product.quantity;
                // cart.totalPrice += product.totalPrice;
                product.totalPrice = productInfo.priceNew * product.quantity;
                cart.totalPrice += product.totalPrice;
            }
        }
    } catch (error) {
        res.redirect('back');
    }
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}

// [POST] /cart/add/:productId
module.exports.addPost = async(req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cart = await Cart.findOne({
        _id: cartId
    });
    const existProductInCart = cart.products.find(
        item => item.productId == productId
    )
    if(existProductInCart){
        await Cart.updateOne({ // Di tim gio hang ma nguoi dung truy cap
            _id: cartId,
            'products.productId': productId
        }, {
            $set: { // Update lai so luong 
                // $in: Di tim trong db xem co ptu nao trong mang tm dieu kien hay khong
                // $push: Them ptu vao mang co trong db
                // $set: Update the item in db
                'products.$.quantity': quantity + existProductInCart.quantity
            }
        })
    } else {
        try {
            await Cart.updateOne({
                _id : cartId
            }, {
                $push: {
                    products: {
                        productId: productId,
                        quantity: quantity
                    }
                },

            })
        } catch(error) {
            res.redirect('back');
        }
    }
    res.redirect('back');
}
// [GET] /cart/delete/:productId
module.exports.delete = async(req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: {
            products: {
                productId: productId
            }
        }
    });
    res.redirect('back');
}
// [GET] /cart/update/:productId/quantity
module.exports.update = async(req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    await Cart.updateOne({
        _id: cartId,
        'products.productId': productId
    }, {
        $set: {
            'products.$.quantity': quantity
        }
    });
    res.redirect('back');
}