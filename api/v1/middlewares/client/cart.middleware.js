const Cart = require("../../models/cart.model");

const funcCreateCart = async (res) => {
    const cart = await Cart.create({ books: [] });

    const expireCookie = 1000 * 60 * 60 * 24 * 7;
    res.cookie("cartId", cart.id, {
        httpOnly: true,
        expires: new Date(Date.now() + expireCookie)
    });
    return cart;
};

module.exports.createCart = async (req, res, next) => {
    let cart;
    const cartId = req.cookies.cartId;
    try {
        if (!cartId) {
            cart = await funcCreateCart(res);
        } else {
            cart = await Cart.findById(cartId);
            if (!cart) {
                cart = await funcCreateCart(res);
            }
        }
        cart.totalBookQuantity = cart.books.reduce((sum, item) => sum + item.quantity, 0);
        req.cart = cart;

        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi server!" });
    }
};