const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderDetail);
router.put("/:id/status", controller.changeOrderStatus);

module.exports = router;