const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const authValidator = require("../../../../validators/auth.validator");

router.get("/", controller.index);
router.put("/", controller.editInfor);
router.put("/password", authValidator.validateChangePassword, controller.changePassword);

module.exports = router;