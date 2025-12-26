const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");
const authValidator = require("../../../../validators/auth.validator");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.post("/login", authValidator.validateLogin, controller.login);
router.post("/refresh-token", controller.requestRefreshToken);
router.post("/logout", authMiddleware.verifyToken, controller.logout);
router.post("/forgot-password", authValidator.validateForgotPassword, controller.forgotPassword);
router.post("/reset-password", authValidator.validateResetPassword, controller.resetPassword);

module.exports = router;
