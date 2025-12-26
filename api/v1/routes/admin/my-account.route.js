const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const authValidator = require("../../../../validators/auth.validator");
const userValidator = require("../../../../validators/user.validator");

router.get("/", controller.index);
router.put("/", userValidator.validateInfor, controller.editInfor);
router.put("/password", authValidator.validateChangePassword, controller.changePassword);

module.exports = router;