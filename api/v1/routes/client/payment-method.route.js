const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/payment-method.controller");

router.get("/", controller.getPaymentMethods);

module.exports = router;