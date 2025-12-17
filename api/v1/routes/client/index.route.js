const userRoute = require("./user.route");
const homeRoute = require("./home.route");
const bookCategoryRoute = require("./book-category.route");
const distributorRoute = require("./distributor.route");
const bookRoute = require("./book.route");
const authMiddleware = require("../../middlewares/client/auth.middleware");


module.exports = (app) => {
    app.use('/home', authMiddleware.verifyToken, homeRoute);
    app.use('/api/v1/user', userRoute);
    app.use('/api/v1/distributor', distributorRoute);
    app.use('/api/v1/book-category', bookCategoryRoute);
    app.use('/api/v1/book', bookRoute);
};