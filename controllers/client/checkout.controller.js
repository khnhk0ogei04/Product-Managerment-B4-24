const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    })
    cart.totalPrice = 0;
    if (cart.products.length > 0){
        for (const product of cart.products){
            const productInfo = await Product.findOne({
                _id: product.productId
            }).select("title thumbnail price discountPercentage slug");
            productInfo.priceNew = ((1 - productInfo.discountPercentage/100) * productInfo.price).toFixed(0);
            product.productInfo = productInfo;
            product.totalPrice = productInfo.priceNew * product.quantity;
            cart.totalPrice += product.totalPrice;
        }
    }
    res.render("client/pages/checkout/index", {
        pageTitle: "Order item",
        cartDetail: cart
    })
}
// [POST] /checkout/orderPost
module.exports.orderPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const orderData = {
        userInfo: userInfo,
        products: []
    }
    const cart = await Cart.findOne({
        _id: cartId
    })
    for (const product of cart.products){
        const productInfo = Product.findOne({
            _id: product.productId
        });
        orderData.products.push({
            productId: product.productId,
            price: productInfo.price,
            discountPercentage: productInfo.discountPercentage,
            quantity: product.quantity
        })
    }
    const order = new Order(orderData);
    await order.save();
    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    })
    res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async(req, res) => {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
        _id: orderId
    })
    let totalPrice = 0;
    // console.log(orderId);
    for (const item of order.products){
        const productInfo = await Product.findOne({
            _id: item.productId
        });
        item.thumbnail = productInfo.thumbnail;
        item.title = productInfo.title;
        item.priceNew = ((1 - productInfo.discountPercentage/100) * productInfo.price).toFixed(0);
        item.totalPrice = item.quantity * item.priceNew;
        totalPrice += item.totalPrice;
    }
    res.render("client/pages/checkout/success", {
        pageTitle: "Order successfully",
        order: order,
        totalPrice: totalPrice
    });
}


/* // [POST] /checkout/orderPost
module.exports.orderPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const userInfo = req.body;
        const orderData = {
            userInfo: userInfo,
            products: []
        }
        const cart = await Cart.findOne({
            _id: cartId
        });

        for (const product of cart.products) {
            const productInfo = await Product.findOne({
                _id: product.productId
            });

            // Check if there is enough stock
            if (productInfo.stock < product.quantity) {
                return res.status(400).send(`Not enough stock for product ${productInfo.name}`);
            }

            orderData.products.push({
                productId: product.productId,
                price: productInfo.price,
                discountPercentage: productInfo.discountPercentage,
                quantity: product.quantity
            });

            // Subtract the ordered quantity from stock
            await Product.updateOne(
                { _id: product.productId },
                { $inc: { stock: -product.quantity } }
            );
        }

        const order = new Order(orderData);
        await order.save();

        // Empty the cart after order is placed
        await Cart.updateOne({
            _id: cartId
        }, {
            products: []
        });

        res.redirect(`/checkout/success/${order.id}`);
    } catch (error) {
        console.error("Error processing order: ", error);
        res.status(500).send("Internal Server Error");
    }
}
*/