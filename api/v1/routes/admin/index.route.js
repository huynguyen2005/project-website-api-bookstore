const bookRoute = require("./book.route");
const bookCategoryRoute = require("./book-category.route");
const authorRoute = require("./author.route");
const publisherRoute = require("./publisher.route");
const paymentMethodRoute = require("./payment-method.route");
const carrierRoute = require("./carrier.route");
const blogRoute = require("./blog.route");
const roleRoute = require("./role.route");
const distributorRoute = require("./distributor.route");
const coverTypeRoute = require("./cover-type.route");
const accountRoute = require("./account.route");
const myAccountRoute = require("./my-account.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
    app.use("/api/v1/admin/book", authMiddleware.verifyToken, authMiddleware.verifyRole, bookRoute);
    app.use("/api/v1/admin/book-category", authMiddleware.verifyToken, authMiddleware.verifyRole, bookCategoryRoute);
    app.use("/api/v1/admin/author", authMiddleware.verifyToken, authMiddleware.verifyRole, authorRoute);
    app.use("/api/v1/admin/publisher", authMiddleware.verifyToken, authMiddleware.verifyRole, publisherRoute);
    app.use("/api/v1/admin/payment-method", authMiddleware.verifyToken, authMiddleware.verifyRole, paymentMethodRoute);
    app.use("/api/v1/admin/carrier", authMiddleware.verifyToken, authMiddleware.verifyRole, carrierRoute);
    app.use("/api/v1/admin/blog", authMiddleware.verifyToken, authMiddleware.verifyRole, blogRoute);
    app.use("/api/v1/admin/role", authMiddleware.verifyToken, authMiddleware.verifyRole, roleRoute);
    app.use("/api/v1/admin/distributor", authMiddleware.verifyToken, authMiddleware.verifyRole, distributorRoute);
    app.use("/api/v1/admin/cover-type", authMiddleware.verifyToken, authMiddleware.verifyRole, coverTypeRoute);
    app.use("/api/v1/admin/account", accountRoute);
    app.use("/api/v1/admin/my-account", authMiddleware.verifyToken, myAccountRoute);
};