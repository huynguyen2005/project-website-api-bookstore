const userRoute = require("./user.route");
const bookCategoryRoute = require("./book-category.route");
const distributorRoute = require("./distributor.route");
const bookRoute = require("./book.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const blogRoute = require("./blog.route");
const paymentMethodRoute = require("./payment-method.route");
const carrierRoute = require("./carrier.route");
const { createCart } = require("../../middlewares/client/cart.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const orderRoute = require("./order.route");
const authRoute = require("./auth.route");

module.exports = (app) => {
    app.use(createCart); 
    app.use("/api/v1/auth", authRoute);
    app.use('/api/v1/distributors', distributorRoute);
    app.use('/api/v1/book-categories', bookCategoryRoute);
    app.use('/api/v1/books', bookRoute);
    app.use('/api/v1/carts', cartRoute);
    app.use('/api/v1/blogs', blogRoute);
    app.use('/api/v1/payment-methods', paymentMethodRoute);
    app.use('/api/v1/carriers', carrierRoute);
    app.use('/api/v1/checkout', checkoutRoute);
    app.use('/api/v1/orders', authMiddleware.verifyToken, orderRoute);
    app.use('/api/v1/my-profile', authMiddleware.verifyToken,  userRoute);
};
