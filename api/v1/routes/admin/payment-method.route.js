const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/payment-method.controller");

router.get("/", controller.index);
router.get("/all", controller.getAll);
router.post("/create", controller.createPaymentMethod);
router.get("/:id", controller.getPaymentMethod);
router.put("/edit/:id", controller.editPaymentMethod);
router.delete("/delete/:id", controller.deletePaymentMethod);

module.exports = router;
