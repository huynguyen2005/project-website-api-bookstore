const bookRoute = require("./book.route");

module.exports = (app) => {
    app.use("/api/v1/admin/books", bookRoute);
};