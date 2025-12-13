const userRoute = require("./user.route");
const homeRoute = require("./home.route");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
    app.use('/home', authMiddleware.verifyToken, homeRoute);
    app.use('/api/v1/user', userRoute);
};