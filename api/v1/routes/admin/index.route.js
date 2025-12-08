const bookRoute = require("./book.route");
const bookCategoryRoute = require("./book-category.route");
const authorRoute = require("./author.route");
const publisherRoute = require("./publisher.route");
const paymentMethodRoute = require("./payment-method.route");
const carrierRoute = require("./carrier.route");
const blogRoute = require("./blog.route");

module.exports = (app) => {
    app.use("/api/v1/admin/book", bookRoute);
    app.use("/api/v1/admin/book-category", bookCategoryRoute);
    app.use("/api/v1/admin/author", authorRoute);
    app.use("/api/v1/admin/publisher", publisherRoute);
    app.use("/api/v1/admin/payment-method", paymentMethodRoute);
    app.use("/api/v1/admin/carrier", carrierRoute);
    app.use("/api/v1/admin/blog", blogRoute);
};