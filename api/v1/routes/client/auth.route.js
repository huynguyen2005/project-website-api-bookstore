const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");
const authValidator = require("../../../../validators/auth.validator");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post("/register", authValidator.validateRegister, controller.register);
router.post("/login", authValidator.validateLogin, controller.login);
router.post("/logout", authMiddleware.verifyToken, controller.logout);
router.post("/refresh-token", controller.requestRefreshToken);

module.exports = router;
