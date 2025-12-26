const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/carrier.controller");

router.get("/", controller.getCarriers);

module.exports = router;