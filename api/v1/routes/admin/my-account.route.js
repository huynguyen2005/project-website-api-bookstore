const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");

router.get("/", controller.index);
router.put("/", controller.editInfor);
router.put("/password", controller.changePassword);

module.exports = router;