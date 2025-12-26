const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");

router.get("/", controller.checkout);
router.post("/", controller.createOrder);
router.post("/callback", controller.callback);
router.get("/:orderId/thank-you", controller.thankYou);

module.exports = router;