const bookRoute = require("./book.route");
const bookCategoryRoute = require("./book-category.route");
const authorRoute = require("./author.route");

module.exports = (app) => {
    app.use("/api/v1/admin/book", bookRoute);
    app.use("/api/v1/admin/book-category", bookCategoryRoute);
    app.use("/api/v1/admin/author", authorRoute);
};