const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controller"); 

router.get("/", controller.getOrders);
router.get("/:orderId", controller.getDetailOrder);

module.exports = router;