const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const userValidator = require("../../../../validators/user.validator");

router.get("/my-profile", controller.getInfor);
router.put("/my-profile", userValidator.validateInfor, controller.changeInfor);

module.exports = router;