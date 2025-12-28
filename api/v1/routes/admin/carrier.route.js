const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/carrier.controller");

router.get("/", controller.index);
router.post("/", controller.createCarrier);
router.get("/:id", controller.getCarrier);
router.put("/:id", controller.editCarrier);
router.delete("/:id", controller.deleteCarrier);
router.delete("/", controller.deleteManyCarrier);

module.exports = router;
