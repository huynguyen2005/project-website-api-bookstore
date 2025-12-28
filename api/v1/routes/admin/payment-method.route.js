const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/payment-method.controller");

router.get("/", controller.index);
router.post("/", controller.createPaymentMethod);
router.get("/:id", controller.getPaymentMethod);
router.put("/:id", controller.editPaymentMethod);
router.delete("/:id", controller.deletePaymentMethod);
router.delete("/", controller.deleteManyPaymentMethod);

module.exports = router;
