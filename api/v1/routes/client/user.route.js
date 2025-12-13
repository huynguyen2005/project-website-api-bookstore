const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", authMiddleware.verifyToken, controller.logout);
router.post("/refresh-token", controller.requestRefreshToken);

module.exports = router;