const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const userValidator = require("../../../../validators/user.validator");
const authValidator = require("../../../../validators/auth.validator");

router.get("/", controller.getInfor);
router.put("/", userValidator.validateInfor, controller.changeInfor);
router.put("/password", authValidator.validateChangePassword, controller.changePassword);

module.exports = router;