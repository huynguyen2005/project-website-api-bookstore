const bookRoute = require("./book.route");
const bookCategoryRoute = require("./book-category.route");

module.exports = (app) => {
    app.use("/api/v1/admin/book", bookRoute);
    app.use("/api/v1/admin/book-category", bookCategoryRoute);
};