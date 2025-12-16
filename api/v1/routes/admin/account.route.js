const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const authValidator = require("../../../../validators/auth.validator");

router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole, controller.index);
router.post("/create", authMiddleware.verifyToken, authMiddleware.verifyRole, controller.createAccount);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole, controller.getAccount);
router.put("/edit/:id", authMiddleware.verifyToken, authMiddleware.verifyRole, controller.editAccount);
router.delete("/delete/:id", authMiddleware.verifyToken, authMiddleware.verifyRole, controller.deleteAccount);
router.post("/login", authValidator.validateLogin, controller.login);
router.post("/refresh-token", controller.requestRefreshToken);
router.post("/logout", authMiddleware.verifyToken, controller.logout);

module.exports = router;